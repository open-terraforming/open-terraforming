import { GameStateValue } from '@shared/game'
import { BaseGameState } from './base-game-state'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'

export class ColoniesProductionGameState extends BaseGameState {
	name = GameStateValue.ColoniesProduction

	onEnter() {
		for (const colony of this.game.state.colonies) {
			if (colony.active) {
				colony.step = Math.min(
					colony.step + 1,
					ColoniesLookupApi.get(colony.code).tradeIncome.slots.length - 1,
				)

				colony.currentlyTradingPlayer = undefined
			}
		}
	}

	transition() {
		return GameStateValue.GenerationEnding
	}
}
