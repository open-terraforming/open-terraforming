import { addDelegateToPartyActionRequest } from '@shared/actions'
import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof addDelegateToPartyActionRequest>['data']

export class AddDelegateToPartyActionHandler extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ party }: Args): void {
		const lobbyIndex = this.game.committee.lobby.findIndex(
			(delegate) => delegate.id === this.player.id,
		)

		if (lobbyIndex >= 0) {
			this.game.committee.lobby.splice(lobbyIndex, 1)
			addDelegate(this.game, party, { id: this.player.id })

			return
		}

		const reserveIndex = this.game.committee.reserve.findIndex(
			(delegate) => delegate?.id === this.player.id,
		)

		if (reserveIndex < 0) {
			throw new Error("Player doesn't have any delegates left")
		}

		if (this.player.money < 5) {
			throw new Error(
				'Player does not have enough money (5) to add delegate to party',
			)
		}

		this.player.money -= 5

		this.game.committee.reserve.splice(reserveIndex, 1)
		addDelegate(this.game, party, { id: this.player.id })

		if (!this.pendingAction) {
			this.actionPlayed()
		}
	}
}
