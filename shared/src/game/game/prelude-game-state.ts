import { CardsLookupApi, CardType } from '@shared/cards'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { f } from '@shared/utils/f'
import { pendingActions } from '@shared/utils/pendingActions'
import { BaseGameState } from './base-game-state'

export class PreludeGameState extends BaseGameState {
	name = GameStateValue.Prelude

	onEnter() {
		this.game.players.forEach((p) => {
			p.state.state = PlayerStateValue.WaitingForTurn
		})

		this.currentPlayer.state = PlayerStateValue.Prelude
		this.playCurrentPlayerPreludes()
	}

	playCurrentPlayerPreludes() {
		this.currentPlayer.usedCards.forEach((c) => {
			const card = CardsLookupApi.get(c.code)

			if (card.type === CardType.Prelude) {
				// TODO: Merge this and "runCardEffects" from PlayerAction?
				const ctx = {
					game: this.game.state,
					player: this.currentPlayer,
					card: c,
				}

				card.playEffects.forEach((e) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					e.perform(ctx, ...([] as any))
				})

				this.game.currentPlayerInstance.filterPendingActions()
			}
		})

		this.game.checkMilestones()
	}

	update() {
		// If current player played all pending actions, pass
		if (pendingActions(this.currentPlayer).length === 0) {
			this.currentPlayer.state = PlayerStateValue.Passed
		}

		// If player passed, move to next
		if (this.currentPlayer.state === PlayerStateValue.Passed) {
			const nextPlayer = this.findNextPlayer()

			if (nextPlayer !== undefined) {
				this.selectCurrentPlayer(nextPlayer, PlayerStateValue.Prelude)

				this.logger.log(f(`Next player: {0}`, this.currentPlayer.name))

				this.playCurrentPlayerPreludes()

				return true
			} else {
				this.logger.log('No next player found')
			}
		}
	}

	transition() {
		if (this.game.all(PlayerStateValue.Passed)) {
			this.game.handleNewGeneration(1)

			return GameStateValue.GenerationInProgress
		}
	}
}
