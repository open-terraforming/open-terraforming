import { ExpansionType } from '@shared/expansions/types'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { worldGovernmentTerraformAction } from '@shared/player-actions'
import { hasExpansion } from '@shared/utils/hasExpansion'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { BaseGameState } from './base-game-state'

export class WorldGovernmentTerraformingGameState extends BaseGameState {
	name = GameStateValue.WorldGovernmentTerraforming

	onEnter() {
		const player = this.state.players[this.state.startingPlayer]
		player.state = PlayerStateValue.WorldGovernmentTerraform
		pushPendingAction(player, worldGovernmentTerraformAction())
		this.game.updated()
	}

	onLeave() {
		this.game.players.forEach((p) => {
			p.state.state = PlayerStateValue.Passed
		})
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
