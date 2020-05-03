import { BaseGameState } from './base-game-state'
import { GameStateValue, PlayerStateValue } from '@shared/index'

export class WaitingForPlayersGameState extends BaseGameState {
	name = GameStateValue.WaitingForPlayers

	transition() {
		if (
			this.state.players.filter(p => !p.bot).length > 0 &&
			this.game.all(PlayerStateValue.Ready)
		) {
			return GameStateValue.Starting
		}
	}
}
