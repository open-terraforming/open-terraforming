import { tradeWithColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { canTradeWithColony } from '@shared/utils/canTradeWithColony'
import { PlayerBaseAction } from '../action'
import { isFail } from '@shared/utils/isFail'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]

		const check = canTradeWithColony({
			player: this.player,
			game: this.game,
			colony,
		})

		if (isFail(check)) {
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

		this.player.money -= check.value.cost

		this.actionPlayed()
	}
}
