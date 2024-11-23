import { addPendingDelegatesRequest } from '@shared/actions'
import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof addPendingDelegatesRequest>['data']

export class AddPendingDelegatesActionHandler extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ party, count }: Args): void {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.PlaceDelegates) {
			throw new Error('You are not placing delegates right now')
		}

		for (let i = 0; i < count; i++) {
			const reserveIndex = this.game.committee.reserve.findIndex(
				(delegate) => delegate?.id === this.player.id,
			)

			// TODO: Not sure if we should allow this with 0 reserve delegates?
			if (reserveIndex < 0) {
				break
			}

			this.game.committee.reserve.splice(reserveIndex, 1)
			addDelegate(this.game, party, { id: this.player.id })
		}

		this.popAction()
	}
}
