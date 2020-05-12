import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class EndedGameState extends BaseGameState {
	name = GameStateValue.Ended

	onEnter() {
		this.state.ended = new Date().toISOString()

		this.game.players.forEach(p => {
			p.finishGame()
		})
	}
}
