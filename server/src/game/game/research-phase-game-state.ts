import { GameStateValue, PlayerStateValue } from '@shared/index'
import { pickCardsAction } from '@shared/player-actions'
import { drawCards, pushPendingAction } from '@shared/utils'
import { BaseGameState } from './base-game-state'

export class ResearchPhaseGameState extends BaseGameState {
	name = GameStateValue.ResearchPhase

	onEnter() {
		this.state.players.forEach(p => {
			pushPendingAction(
				p,
				pickCardsAction(
					this.state.draft ? p.draftedCards : drawCards(this.state, 4)
				)
			)

			p.state = PlayerStateValue.Picking
		})
	}

	onLeave() {
		this.state.players.forEach(p => {
			p.draftedCards = []
		})
	}

	transition() {
		if (this.game.all(PlayerStateValue.WaitingForTurn)) {
			return GameStateValue.GenerationInProgress
		}
	}
}
