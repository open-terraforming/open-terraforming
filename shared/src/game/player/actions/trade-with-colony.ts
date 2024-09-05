import { tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { canAffordTradeWithColony } from '@shared/utils/canAffordTradeWithColony'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]

		if (!colony.active) {
			throw new Error('Colony is not active')
		}

		if (typeof colony.currentlyTradingPlayer === 'number') {
			throw new Error('Colony is already trading')
		}

		if (colony.playersAtSteps.includes(this.playerIndex)) {
			throw new Error('Player already has a colony on this colony')
		}

		if (
			!canAffordTradeWithColony({
				player: this.player,
				game: this.game,
				colony,
			})
		) {
			throw new Error('Player cannot afford to trade')
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

		this.player.money -= 9

		this.actionPlayed()
	}
}
