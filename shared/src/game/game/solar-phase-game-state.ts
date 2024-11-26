import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { BaseGameState } from './base-game-state'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { solarPhaseTerraformAction } from '@shared/player-actions'
import { ExpansionType } from '@shared/expansions/types'
import { hasExpansion } from '@shared/utils/hasExpansion'

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
			if (this.game.isMarsTerraformed) {
				return GameStateValue.EndingTiles
			}

			if (this.game.state.colonies.length > 0) {
				return GameStateValue.ColoniesProduction
			}

			if (hasExpansion(this.game.state, ExpansionType.Turmoil)) {
				return GameStateValue.Turmoil
			}

			return GameStateValue.GenerationEnding
		}
	}
}
