import { GameStateValue, PlayerStateValue } from '@shared/game'
import { BaseGameState } from './base-game-state'
import { pushPendingAction } from '@shared/utils'
import { solarPhaseTerraformAction } from '@shared/player-actions'

export class SolarPhaseGameState extends BaseGameState {
	name = GameStateValue.SolarPhase

	onEnter() {
		const player = this.state.players[this.state.startingPlayer]
		player.state = PlayerStateValue.SolarPhaseTerraform
		pushPendingAction(player, solarPhaseTerraformAction())
		this.game.updated()
	}

	transition() {
		console.log({
			transition: this.game.players
				.map((p) => p.state.pendingActions)
				.filter((p) => p.length !== 0)
				.map((p) => JSON.stringify(p)),
			shouldTransition: this.game.players.every(
				(p) => p.state.pendingActions.length === 0,
			),
		})

		if (this.game.players.every((p) => p.state.pendingActions.length === 0)) {
			return GameStateValue.GenerationEnding
		}
	}
}
