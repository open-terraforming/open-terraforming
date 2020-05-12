import { BaseGameState } from './base-game-state'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { f } from '@shared/utils'

export class GenerationInProgressGameState extends BaseGameState {
	name = GameStateValue.GenerationInProgress

	onEnter() {
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
			return GameStateValue.GenerationEnding
		}
	}
}
