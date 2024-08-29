import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class GenerationStartGameState extends BaseGameState {
	name = GameStateValue.GenerationStart

	onEnter() {
		this.state.generation++
		this.game.handleNewGeneration(this.state.generation)

		this.state.startingPlayer =
			(this.state.startingPlayer + 1) % this.state.players.length

		this.logger.log(`New generation ${this.state.generation}`)
	}

	transition() {
		if (this.state.draft) {
			return GameStateValue.Draft
		} else {
			return GameStateValue.ResearchPhase
		}
	}
}
