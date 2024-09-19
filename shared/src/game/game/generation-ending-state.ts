import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class GenerationEndingState extends BaseGameState {
	name = GameStateValue.GenerationEnding

	onEnter() {
		this.state.state = GameStateValue.GenerationEnding
		this.game.handleGenerationEnd()

		this.doProduction()
	}

	doProduction() {
		for (const p of this.game.players) {
			p.endGeneration()
		}
	}

	transition() {
		if (this.game.isMarsTerraformed) {
			return GameStateValue.EndingTiles
		} else {
			return GameStateValue.GenerationStart
		}
	}
}
