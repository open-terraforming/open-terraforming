import { GameStateValue } from '@shared/gameState'
import { BaseGameState } from './base-game-state'
import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { hasExpansion } from '@shared/utils/hasExpansion'
import { ExpansionType } from '@shared/expansions/types'

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
		if (hasExpansion(this.game.state, ExpansionType.Turmoil)) {
			return GameStateValue.Turmoil
		}

		return GameStateValue.GenerationEnding
	}
}
