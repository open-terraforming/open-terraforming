import { GameStateValue } from '@shared/game'
import { BaseGameState } from './base-game-state'

export class ColoniesProductionGameState extends BaseGameState {
	name = GameStateValue.ColoniesProduction

	onEnter() {
		for (const colony of this.game.state.colonies) {
			if (colony.active) {
				colony.step++
			}
		}
	}

	transition() {
		return GameStateValue.GenerationEnding
	}
}
