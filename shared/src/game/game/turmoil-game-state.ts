import { addDelegate } from '@shared/expansions/turmoil/utils/addDelegate'
import { drawGlobalEvent } from '@shared/expansions/turmoil/utils/drawGlobalEvent'
import { getPartyState } from '@shared/expansions/turmoil/utils/getPartyState'
import { recalculateDominantParty } from '@shared/expansions/turmoil/utils/recalculateDominantParty'
import { GameState, GameStateValue } from '@shared/gameState'
import { deepCopy } from '@shared/utils/collections'
import { getCommitteeParty } from '@shared/utils/getCommitteeParty'
import { getGlobalEvent } from '@shared/utils/getGlobalEvent'
import { getPlayerById } from '@shared/utils/getPlayerById'
import { pendingActions } from '@shared/utils/pendingActions'
import { playerId } from '@shared/utils/playerId'
import { buildEvents } from '../events/buildEvents'
import { EventType } from '../events/eventTypes'
import { BaseGameState } from './base-game-state'

export class TurmoilGameState extends BaseGameState {
	name = GameStateValue.Turmoil

	onEnter() {
		const game = this.game.state

		for (const player of game.players) {
			player.terraformRating -= 1
		}

		this.executeCurrentGlobalEvent(game)
		this.processNewGovernment(game)
		this.shiftGlobalEvents(game)

		this.game.updated()
	}

	private shiftGlobalEvents(game: GameState) {
		const startingState = deepCopy(this.game.state)

		if (game.globalEvents.currentEvent) {
			game.globalEvents.discardedEvents.push(game.globalEvents.currentEvent)
		}

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

		this.game.pushEvent({
			type: EventType.GlobalEventsChanged,
			previous: {
				current: startingState.globalEvents.currentEvent,
				coming: startingState.globalEvents.comingEvent,
				distant: startingState.globalEvents.distantEvent,
			},
			current: {
				current: game.globalEvents.currentEvent,
				coming: game.globalEvents.comingEvent,
				distant: game.globalEvents.distantEvent,
			},
			changes: buildEvents(startingState, this.game.state),
		})

		return startingState
	}

	private processNewGovernment(game: GameState) {
		const startingState = deepCopy(this.game.state)

		if (game.committee.dominantParty) {
			if (game.committee.rulingParty) {
				const previousRuling = getCommitteeParty(game.committee.rulingParty)

				for (const passivePolicy of previousRuling.policy.passive) {
					passivePolicy.onDeactivate?.({ game })
				}
			}

			game.committee.rulingParty = game.committee.dominantParty

			const rulingParty = getCommitteeParty(game.committee.dominantParty)
			const rulingPartyState = getPartyState(game, rulingParty.code)

			rulingParty.bonus.apply(game)

			for (const passivePolicy of rulingParty.policy.passive) {
				passivePolicy.onActivate?.({ game })
			}

			if (game.committee.chairman) {
				game.committee.reserve.push(game.committee.chairman.playerId)
				game.committee.chairman = null
			}

			game.committee.reserve.push(
				...rulingPartyState.members.map((m) => m.playerId),
			)

			rulingPartyState.members = []

			if (rulingPartyState.leader) {
				// +1 TR for becoming chairman
				if (rulingPartyState.leader.playerId) {
					const rulingLeaderPlayer = getPlayerById(
						game,
						rulingPartyState.leader.playerId.id,
					)

					rulingLeaderPlayer.terraformRating++
				}

				game.committee.chairman = { ...rulingPartyState.leader }
				rulingPartyState.leader = null
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

		if (startingState.committee.rulingParty && game.committee.rulingParty) {
			this.game.pushEvent({
				type: EventType.NewGovernment,
				oldRulingParty: startingState.committee.rulingParty,
				newRulingParty: game.committee.rulingParty,
				changes: buildEvents(startingState, this.game.state),
			})
		}
	}

	private executeCurrentGlobalEvent(game: GameState) {
		if (game.globalEvents.currentEvent) {
			const currentEffects = getGlobalEvent(
				game.globalEvents.currentEvent,
			).effects

			const startingState = deepCopy(this.game.state)

			for (const effect of currentEffects) {
				effect.apply(game)
			}

			this.game.pushEvent({
				type: EventType.CurrentGlobalEventExecuted,
				changes: buildEvents(startingState, this.game.state),
				eventCode: game.globalEvents.currentEvent,
			})
		}
	}

	transition() {
		if (this.game.players.every((p) => pendingActions(p.state).length === 0)) {
			return GameStateValue.GenerationEnding
		}
	}
}
