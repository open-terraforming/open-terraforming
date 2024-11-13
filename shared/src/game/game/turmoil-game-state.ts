import { CommitteePartiesLookupApi } from '@shared/CommitteePartiesLookupApi'
import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { drawGlobalEvent } from '@shared/expansions/turmoil/utils/drawGlobalEvent'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { recalculateDominantParty } from '@shared/expansions/turmoil/utils/recalculateDominantParty'
import { GameStateValue } from '@shared/gameState'
import { pendingActions } from '@shared/utils'
import { getGlobalEvent } from '@shared/utils/getGlobalEvent'
import { getPlayerById } from '@shared/utils/getPlayerById'
import { playerId } from '@shared/utils/playerId'
import { BaseGameState } from './base-game-state'

export class TurmoilGameState extends BaseGameState {
	name = GameStateValue.Turmoil

	onEnter() {
		const game = this.game.state

		for (const player of game.players) {
			player.terraformRating -= 1
		}

		if (!game.globalEvents.currentEvent) {
			throw new Error("No global event, this shouldn't happen")
		}

		const globalEventEffects = getGlobalEvent(
			game.globalEvents.currentEvent,
		).effects

		for (const effect of globalEventEffects) {
			effect.apply(game)
		}

		if (game.committee.dominantParty) {
			game.committee.rulingParty = game.committee.dominantParty

			const rulingParty = CommitteePartiesLookupApi.get(
				game.committee.rulingParty,
			)

			const rulingPartyState = getPartyState(game, rulingParty.code)

			rulingParty.bonus.apply(game)

			if (game.committee.chairman) {
				game.committee.reserve.push(game.committee.chairman.playerId)
				game.committee.chairman = null
			}

			game.committee.reserve.push(
				...rulingPartyState.members.map((m) => m.playerId),
			)

			rulingPartyState.members = []

			if (rulingPartyState.partyLeader) {
				// +1 TR for becoming chairman
				if (rulingPartyState.partyLeader.playerId) {
					const rulingLeaderPlayer = getPlayerById(
						game,
						rulingPartyState.partyLeader.playerId.id,
					)

					rulingLeaderPlayer.terraformRating++
				}

				game.committee.chairman = { ...rulingPartyState.partyLeader }
				rulingPartyState.partyLeader = null
			}

			// TODO: What about tie? It should rotate between tied parties
			recalculateDominantParty(game)
		}

		// Make sure each player has at least one delegate in the lobby
		for (const player of game.players) {
			if (!game.committee.lobby.some((d) => d.id === player.id)) {
				const reserveIndex = game.committee.reserve.findIndex(
					(d) => d && d.id === player.id,
				)

				if (reserveIndex !== -1) {
					game.committee.reserve.splice(reserveIndex, 1)
					game.committee.lobby.push(playerId(player.id))
				}
			}
		}

		// Move global events around
		game.globalEvents.discardedEvents.push(game.globalEvents.currentEvent)
		game.globalEvents.currentEvent = game.globalEvents.comingEvent
		game.globalEvents.comingEvent = game.globalEvents.distantEvent
		game.globalEvents.distantEvent = drawGlobalEvent(game)

		// Add new delegates
		if (game.globalEvents.currentEvent) {
			addDelegate(
				game,
				getGlobalEvent(game.globalEvents.currentEvent).effectDelegate,
				null,
			)
		}

		addDelegate(
			game,
			getGlobalEvent(game.globalEvents.distantEvent).initialDelegate,
			null,
		)

		// TODO: Maybe add event?

		this.game.updated()
	}

	transition() {
		if (this.game.players.every((p) => pendingActions(p.state).length === 0)) {
			return GameStateValue.GenerationEnding
		}
	}
}
