import { tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import {
	canTradeWithColony,
	canTradeWithColonyUsingResource,
} from '@shared/expansions/colonies/utils'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { isFailure } from '@shared/utils'
import { PlayerBaseAction } from '../action'
import { PlayerActionType } from '@shared/player-actions'
import { Resource } from '@shared/cards'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex, resource }: Args): void {
		if (resource !== 'energy' && resource !== 'money' && resource !== 'titan') {
			throw new Error('Invalid resource')
		}

		let cost = 0
		let costResource: Resource = resource

		const colony = this.game.colonies[colonyIndex]
		const pendingAction = this.pendingAction

		if (pendingAction?.type === PlayerActionType.TradeWithColony) {
			const check = canTradeWithColony({
				player: this.player,
				game: this.game,
				colony,
			})

			if (isFailure(check)) {
				throw new Error(check.error)
			}
		} else {
			const check = canTradeWithColonyUsingResource({
				player: this.player,
				game: this.game,
				colony,
				resource,
			})

			if (isFailure(check)) {
				throw new Error(check.error)
			}

			cost = check.value.cost
			costResource = check.value.resource
		}

		this.parent.onBeforeColonyTrade.emit({
			colony,
			player: this.parent,
			resource,
		})

		const colonyData = ColoniesLookupApi.get(colony.code)

		for (const colonyOfPlayerIndex of colony.playersAtSteps) {
			colonyData.incomeBonus.perform({
				colony,
				game: this.game,
				player: this.game.players[colonyOfPlayerIndex],
			})
		}

		colonyData.tradeIncome.perform({
			colony,
			game: this.game,
			player: this.player,
		})

		colony.currentlyTradingPlayer = this.playerIndex
		// Returns the colony indicator to the left
		colony.step = Math.max(0, colony.playersAtSteps.length)

		this.player[costResource] -= cost

		this.actionPlayed()
	}
}
