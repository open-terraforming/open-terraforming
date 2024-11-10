import { shuffle } from '@shared/utils'
import { expansion, ExpansionType } from '../types'
import { turmoilCommitteeParties } from './turmoilCommitteeParties'

export const turmoilExpansion = expansion({
	name: 'Turmoil',
	type: ExpansionType.Turmoil,
	initialize: (game) => {
		// TODO: This should be separate step so other expansions can add their parties
		game.committeePartyCards.push(...turmoilCommitteeParties.map((p) => p.code))

		shuffle(game.committeePartyCards)

		game.committee.parties.push(
			// TODO: Number of parties should be configurable?
			...game.committeePartyCards.slice(0, 6).map((p) => ({
				code: p,
				partyLeader: null,
				members: [],
			})),
		)

		// TODO: What next?
	},
})
