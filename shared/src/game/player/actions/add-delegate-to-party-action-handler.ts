import { addDelegateToPartyActionRequest } from '@shared/actions'
import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { GameStateValue, PlayerStateValue } from '@shared/gameState'
import { PlayerBaseActionHandler } from '../action'
import { EventType } from '@shared/game/events/eventTypes'

type Args = ReturnType<typeof addDelegateToPartyActionRequest>['data']

export class AddDelegateToPartyActionHandler extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ party }: Args): void {
		const lobbyIndex = this.game.committee.lobby.findIndex(
			(delegate) => delegate.id === this.player.id,
		)

		if (lobbyIndex >= 0) {
			const collector = this.parent.game.startEventsCollector()

			this.game.committee.lobby.splice(lobbyIndex, 1)
			addDelegate(this.game, party, { id: this.player.id })

			collector.collectAndPush((changes) => ({
				type: EventType.PlayerMovedDelegate,
				playerId: this.player.id,
				changes,
				change: 1,
				partyCode: party,
			}))

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

		const collector = this.parent.game.startEventsCollector()

		this.player.money -= 5

		this.game.committee.reserve.splice(reserveIndex, 1)
		addDelegate(this.game, party, { id: this.player.id })

		collector.collectAndPush((changes) => ({
			type: EventType.PlayerMovedDelegate,
			playerId: this.player.id,
			changes,
			change: 1,
			partyCode: party,
		}))

		this.actionPlayed()
	}
}
