import { GameStateValue, PlayerStateValue } from '@shared/index'
import { draftCardAction } from '@shared/player-actions'
import { drawCards, pushPendingAction } from '@shared/utils'
import { BaseGameState } from './base-game-state'

export class DraftGameState extends BaseGameState {
	name = GameStateValue.Draft

	onEnter() {
		this.state.players.forEach(p => {
			pushPendingAction(p, draftCardAction(drawCards(this.state, 4)))
			p.state = PlayerStateValue.Picking
		})
	}

	transition() {
		if (this.game.all(PlayerStateValue.WaitingForTurn)) {
			return GameStateValue.ResearchPhase
		}
	}
}
