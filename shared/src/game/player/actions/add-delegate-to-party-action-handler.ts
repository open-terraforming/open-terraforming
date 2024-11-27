import { addDelegateToPartyActionRequest } from '@shared/actions'
import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import {
	CommitteePartyState,
	GameStateValue,
	PlayerStateValue,
} from '@shared/gameState'
import { PlayerBaseActionHandler } from '../action'
import { EventType } from '@shared/game/events/eventTypes'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { deepCopy } from '@shared/utils/collections'

type Args = ReturnType<typeof addDelegateToPartyActionRequest>['data']

export class AddDelegateToPartyActionHandler extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ party }: Args): void {
		const lobbyIndex = this.game.committee.lobby.findIndex(
			(delegate) => delegate.id === this.player.id,
		)

		const collector = this.parent.game.startEventsCollector()

		if (lobbyIndex >= 0) {
			this.game.committee.lobby.splice(lobbyIndex, 1)
		} else {
			if (this.player.money < 5) {
				throw new Error(
					'Player does not have enough money (5) to add delegate to party',
				)
			}

			const reserveIndex = this.game.committee.reserve.findIndex(
				(delegate) => delegate?.id === this.player.id,
			)

			if (reserveIndex < 0) {
				throw new Error("Player doesn't have any delegates left")
			}

			this.player.money -= 5
			this.game.committee.reserve.splice(reserveIndex, 1)
		}

		addDelegate(this.game, party, { id: this.player.id })

		collector.collectAndPush((changes) => ({
			type: EventType.PlayerMovedDelegate,
			playerId: this.player.id,
			changes,
			change: 1,
			partyCode: party,
			partyState: deepCopy(
				getPartyState(this.game, party),
			) as CommitteePartyState,
		}))

		this.actionPlayed()
	}
}
