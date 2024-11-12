import { shuffle } from '@shared/utils'
import { expansion, ExpansionType } from '../types'
import { turmoilCommitteeParties } from './turmoilCommitteeParties'
import { turmoilGlobalEvents } from './turmoilGlobalEvents'

export const turmoilExpansion = expansion({
	name: 'Turmoil',
	type: ExpansionType.Turmoil,
	initialize: (game) => {
		// TODO: This should be separate step so other expansions can add their parties
		game.committeeParties.push(...turmoilCommitteeParties.map((p) => p.code))

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

		game.globalEvents.enabled = true

		// TODO: Those should be instead collected from all expansions
		game.globalEvents.events = [...turmoilGlobalEvents.map((e) => e.code)]

		shuffle(game.globalEvents.events)

		// TODO: What next?
	},
})
