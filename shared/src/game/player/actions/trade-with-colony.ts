import { tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { canTradeWithColonyUsingResource, isFailure } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex, resource }: Args): void {
		if (resource !== 'energy' && resource !== 'money' && resource !== 'titan') {
			throw new Error('Invalid resource')
		}

		const colony = this.game.colonies[colonyIndex]

		const check = canTradeWithColonyUsingResource({
			player: this.player,
			game: this.game,
			colony,
			resource,
		})

		if (isFailure(check)) {
			throw new Error(check.error)
		}

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
		// TODO: Is this correct?
		colony.step = Math.max(2, colony.playersAtSteps.length)

		this.player[check.value.resource] -= check.value.cost

		this.actionPlayed()
	}
}
