import { GameState, PlayerId } from '@shared/index'
import { getPartyState } from './getPartyState'
import { recalculatePartyLeader } from './recalculatePartyLeader'
import { recalculateDominantParty } from './recalculateDominantParty'

export const addDelegate = (
	game: GameState,
	partyCode: string,
	player: PlayerId | null,
) => {
	const partyState = getPartyState(game, partyCode)

	partyState.members.push({ playerId: player })

	recalculatePartyLeader(partyState)
	recalculateDominantParty(game)
}
