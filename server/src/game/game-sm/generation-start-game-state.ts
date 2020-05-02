import { BaseGameState } from './base-game-state'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { pushPendingAction, drawCards } from '@shared/utils'
import { pickCardsAction } from '@shared/player-actions'

export class GenerationStartGameState extends BaseGameState {
	name = GameStateValue.GenerationStart

	onEnter() {
		this.state.players.forEach(p => {
			pushPendingAction(p, pickCardsAction(drawCards(this.state, 4)))
			p.state = PlayerStateValue.Picking
		})

		this.state.generation++
		this.game.handleNewGeneration(this.state.generation)

		this.state.startingPlayer =
			(this.state.startingPlayer + 1) % this.state.players.length

		this.logger.log(`New generation ${this.state.generation}`)
	}

	transition() {
		if (this.game.all(PlayerStateValue.Ready)) {
			return GameStateValue.GenerationInProgress
		}
	}
}
