import { tradeWithColony } from '@shared/actions'
import { Resource } from '@shared/cards'
import { performTradeWithColony } from '@shared/expansions/colonies/actions/performTradeWithColony'
import {
	canTradeWithColony,
	canTradeWithColonyUsingResource,
} from '@shared/expansions/colonies/utils'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { EventType } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { isFailure } from '@shared/utils'
import { deepCopy } from '@shared/utils/collections'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColonyAction extends PlayerBaseActionHandler<Args> {
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

		const stepBeforeTrade = colony.step
		const collector = this.startCollectingEvents()

		this.parent.onBeforeColonyTrade.emit({
			colony,
			player: this.parent,
			resource,
		})

		performTradeWithColony({
			game: this.game,
			player: this.player,
			colonyIndex,
			cost,
			costResource,
		})

		collector.collectAndPush(
			(changes) =>
				({
					type: EventType.ColonyTrading,
					playerId: this.player.id,
					colony: +colonyIndex,
					at: stepBeforeTrade,
					state: deepCopy(colony),
					changes,
				}) as const,
		)

		if (pendingAction) {
			this.popAction()
		} else {
			if (!this.pendingAction) {
				this.actionPlayed()
			}
		}
	}
}
