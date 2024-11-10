import { GameState, PlayerState } from '@shared/index'

export const getPlayerInfluence = (game: GameState, player: PlayerState) => {
	const hasChairman = game.committee.chairman?.playerId?.id === player.id

	const dominantParty = game.committee.parties.find(
		(p) => p.code === game.committee.dominantParty,
	)

	const isLeaderOfDominantParty =
		dominantParty?.partyLeader?.playerId?.id === player.id

	const hasMemberInDominantParty = dominantParty?.members.some(
		(m) => m.playerId?.id === player.id,
	)

	return (
		(hasChairman ? 1 : 0) +
		(isLeaderOfDominantParty ? 1 : 0) +
		(hasMemberInDominantParty ? 1 : 0)
	)
}
