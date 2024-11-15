import { CommitteePartyState } from '@shared/index'
import { groupBy } from '@shared/utils/groupBy'

export const recalculatePartyLeader = (partyState: CommitteePartyState) => {
	const membersByPlayer = groupBy(partyState.members, (m) => m.playerId)

	// Tie shouldn't be possible here since we've just added a new member and we only switch leader when the top count changes
	const topPlayer = [...membersByPlayer.entries()]
		.map(([playerId, members]) => ({
			playerId,
			count: members.length,
		}))
		.sort((a, b) => b.count - a.count)[0]

	const currentLeaderCount =
		(partyState.leader !== null
			? membersByPlayer.get(partyState.leader.playerId)?.length
			: null) ?? 0

	if (partyState.leader === null || topPlayer.count > currentLeaderCount) {
		partyState.leader = { playerId: topPlayer.playerId }
	}
}
