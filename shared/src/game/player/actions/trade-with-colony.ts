import { tradeWithColony } from '@shared/actions'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { PlayerBaseAction } from '../action'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { getPlayerIndex } from '@shared/utils'

type Args = ReturnType<typeof tradeWithColony>['data']

export class TradeWithColony extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]

		if (!colony.active) {
			throw new Error('Colony is not active')
		}

		if (colony.currentlyTradingPlayer) {
			throw new Error('Colony is already trading')
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

		colony.currentlyTradingPlayer = getPlayerIndex(this.game, this.player.id)
		// Returns the colony indicator to the left
		// TODO: Is this correct?
		colony.step = Math.max(2, colony.playersAtSteps.length)
	}
}
