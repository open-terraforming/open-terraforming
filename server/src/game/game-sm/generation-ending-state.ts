import { wait } from '@/utils/async'
import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class GenerationEndingState extends BaseGameState {
	name = GameStateValue.GenerationEnding

	produced = false

	onEnter() {
		this.produced = false

		this.state.state = GameStateValue.GenerationEnding
		this.game.handleGenerationEnd()

		this.doProduction().then(() => {
			this.produced = true
		})
	}

	async doProduction() {
		for (const p of this.game.players) {
			await wait(1000)

			p.endGeneration()
			this.game.updated()
		}

		await wait(1000)
	}

	transition() {
		if (this.produced) {
			if (this.game.hasReachedLimits) {
				return GameStateValue.EndingTiles
			} else {
				return GameStateValue.GenerationStart
			}
		}
	}
}
