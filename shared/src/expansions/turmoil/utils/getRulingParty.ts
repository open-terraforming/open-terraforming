import { getCommitteeParty } from '@shared/utils/getCommitteeParty'
import { GameState } from '../../..'

export const getRulingParty = (game: GameState) => {
	if (!game.committee.rulingParty) {
		return
	}

	return getCommitteeParty(game.committee.rulingParty)
}
