import { CommitteePartyState, PlayerState } from '@shared/index'

export const getPlayerDelegateCount = (
	party: CommitteePartyState,
	player: PlayerState,
) =>
	party.members.filter((d) => d.playerId?.id === player.id).length +
	(party.leader?.playerId?.id === player.id ? 1 : 0)
