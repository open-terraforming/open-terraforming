import { GameStateValue, PlayerStateValue } from '@shared/gameState'
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
		if (this.game.players.every((p) => p.state.pendingActions.length === 0)) {
			if (this.game.state.colonies.length > 0) {
				return GameStateValue.ColoniesProduction
			}

			return GameStateValue.GenerationEnding
		}
	}
}
