import { GameStateValue, PlayerStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'
import { pendingActions, f } from '@shared/utils'

export class EndingTilesGameState extends BaseGameState {
	name = GameStateValue.EndingTiles

	onEnter() {
		this.game.players.forEach(p => {
			p.state.pendingActions = []

			p.buyAllGreeneries()
			p.filterPendingActions()

			p.state.state =
				p.state.pendingActions.length > 0
					? PlayerStateValue.WaitingForTurn
					: PlayerStateValue.Passed
		})

		this.selectCurrentPlayer(
			this.state.startingPlayer,
			PlayerStateValue.EndingTiles
		)
	}

	update() {
		if (
			this.game.currentPlayer.state === PlayerStateValue.EndingTiles &&
			pendingActions(this.game.currentPlayer).length === 0
		) {
			this.game.currentPlayer.state = PlayerStateValue.Passed
		}

		if (this.game.currentPlayer.state === PlayerStateValue.Passed) {
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
			return GameStateValue.Ended
		}
	}
}
