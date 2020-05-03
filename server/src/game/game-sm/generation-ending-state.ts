import { wait } from '@/utils/async'
import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class GenerationEndingState extends BaseGameState {
	name = GameStateValue.GenerationEnding

	produced = false
	checkLock = true

	production?: Promise<void>

	onEnter() {
		this.checkLock = false
		this.produced = false
		this.createLock()

		this.state.state = GameStateValue.GenerationEnding
		this.game.handleGenerationEnd()

		this.production = this.doProduction().then(() => {
			this.clearLock()
			this.produced = true
			this.game.updated()
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

	update() {
		if (this.checkLock) {
			const lock = this.getLock()

			if (lock) {
				this.clearLock()
				this.game.load(lock)
				this.onEnter()
			}
		}

		if (!this.production) {
			this.onEnter()
		}
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
