import { CardSpecial } from '@shared/cards'
import { GlobalEventsLookupApi } from '@shared/GlobalEventsLookupApi'
import { repeat, shuffle } from '@shared/utils'
import { expansion, ExpansionType } from '../types'
import { turmoilCommitteeParties } from './turmoilCommitteeParties'
import { turmoilGlobalEvents } from './turmoilGlobalEvents'
import { addDelegate } from './utils/addDelegate'
import { drawGlobalEvent } from './utils/drawGlobalEvent'

export const turmoilExpansion = expansion({
	name: 'Turmoil',
	type: ExpansionType.Turmoil,
	getCommitteeParties: () => turmoilCommitteeParties,
	getGlobalEvents: (game) =>
		// TODO: Maybe those global events should be defined in their respective expansions?
		turmoilGlobalEvents.filter(
			(e) =>
				(!e.special?.includes(CardSpecial.Colonies) ||
					game.expansions.includes(ExpansionType.Colonies)) &&
				(!e.special?.includes(CardSpecial.Venus) ||
					game.expansions.includes(ExpansionType.Venus)),
		),
	initialize: (game) => {
		shuffle(game.committeeParties)

		game.committee.enabled = true

		game.committee.parties.push(
			// TODO: Number of parties should be configurable?
			...game.committeeParties.slice(0, 6).map((p) => ({
				code: p,
				partyLeader: null,
				members: [],
			})),
		)

		// Greens start as the ruling party
		game.committee.rulingParty = 'greens'

		// 1 delegate per player in lobby
		game.committee.lobby.push(...game.players.map((p) => ({ id: p.id })))

		// 6 delegates per player in reserve
		game.committee.reserve.push(
			...game.players.flatMap((p) => repeat(6).map(() => ({ id: p.id }))),
		)

		// 14 neutral delegates
		game.committee.reserve.push(...repeat(14).map(() => null))

		// neutral chairman at the start
		game.committee.chairman = { playerId: null }

		game.globalEvents.enabled = true

		shuffle(game.globalEvents.events)

		game.globalEvents.comingEvent = drawGlobalEvent(game)

		addDelegate(
			game,
			GlobalEventsLookupApi.get(game.globalEvents.comingEvent).initialDelegate,
			null,
		)

		game.globalEvents.currentEvent = drawGlobalEvent(game)

		addDelegate(
			game,
			GlobalEventsLookupApi.get(game.globalEvents.currentEvent).initialDelegate,
			null,
		)

		// TODO: What next?
	},
})
