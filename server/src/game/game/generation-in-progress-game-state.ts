import { BaseGameState } from './base-game-state'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { f } from '@shared/utils'

export class GenerationInProgressGameState extends BaseGameState {
	name = GameStateValue.GenerationInProgress

	onEnter() {
		this.game.players.forEach(p => {
			p.state.state = PlayerStateValue.WaitingForTurn
		})

		this.selectCurrentPlayer(this.state.startingPlayer)
	}

	update() {
		if (
			[PlayerStateValue.WaitingForTurn, PlayerStateValue.Passed].includes(
				this.game.currentPlayer.state
			)
		) {
			const nextPlayer = this.findNextPlayer()

			if (nextPlayer !== undefined) {
				this.selectCurrentPlayer(nextPlayer)

				this.logger.log(f(`Next player: {0}`, this.game.currentPlayer.name))

				return true
			} else {
				this.logger.log('No next player found')
			}
		}
	}

	transition() {
		if (this.game.all(PlayerStateValue.Passed)) {
			if (
				this.game.state.solarPhase &&
				(this.game.state.venus < this.game.state.map.venus ||
					this.game.state.temperature < this.game.state.map.temperature ||
					this.game.state.oxygen < this.game.state.map.oxygen ||
					this.game.state.oceans < this.game.state.map.oceans)
			) {
				return GameStateValue.SolarPhase
			}

			return GameStateValue.GenerationEnding
		}
	}
}
