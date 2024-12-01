import { GameState } from '@shared/index'

export const getPartyState = (game: GameState, partyCode: string) => {
	const partyState = game.committee.parties.find((p) => p.code === partyCode)

	if (!partyState) {
		throw new Error(`Party ${partyCode} not found`)
	}

	return partyState
}
