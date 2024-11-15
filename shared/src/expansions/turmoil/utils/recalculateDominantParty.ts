import { GameState } from '@shared/index'
import { getPartyState } from './getPartyState'

export const recalculateDominantParty = (game: GameState) => {
	const sortedParties = game.committee.parties
		.map((p) => ({
			code: p.code,
			count: p.members.length + (p.leader !== null ? 1 : 0),
		}))
		.sort((a, b) => b.count - a.count)

	const topParty = sortedParties[0]

	if (game.committee.dominantParty === null) {
		game.committee.dominantParty = topParty.code

		return
	}

	const dominantPartyState = getPartyState(game, game.committee.dominantParty)

	const dominantPartyCount =
		dominantPartyState.members.length +
		(dominantPartyState.leader !== null ? 1 : 0)

	if (topParty.count > dominantPartyCount) {
		game.committee.dominantParty = topParty.code
	}
}
