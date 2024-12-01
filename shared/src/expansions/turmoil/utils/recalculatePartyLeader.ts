import { CommitteePartyState } from '@shared/index'
import { groupBy } from '@shared/utils/groupBy'

export const recalculatePartyLeader = (partyState: CommitteePartyState) => {
	const membersByPlayer = groupBy(partyState.members, (m) => m.playerId?.id)

	if (partyState.leader) {
		if (!membersByPlayer.has(partyState.leader.playerId?.id)) {
			membersByPlayer.set(partyState.leader.playerId?.id, [])
		}

		membersByPlayer.get(partyState.leader.playerId?.id)?.push(partyState.leader)
	}

	// Tie shouldn't be possible here since we've just added a new member and we only switch leader when the top count changes
	const topPlayer = [...membersByPlayer.entries()]
		.map(([playerId, members]) => ({
			playerId,
			count: members.length,
		}))
		.sort((a, b) => b.count - a.count)[0]

	const currentLeaderCount =
		(partyState.leader !== null
			? membersByPlayer.get(partyState.leader.playerId?.id)?.length
			: null) ?? 0

	if (partyState.leader === null || topPlayer.count > currentLeaderCount) {
		if (partyState.leader !== null) {
			partyState.members.push({ playerId: partyState.leader.playerId })
		}

		partyState.leader = {
			playerId: topPlayer.playerId ? { id: topPlayer.playerId } : null,
		}

		const memberToRemove = partyState.members.findIndex(
			(m) => m.playerId?.id === topPlayer.playerId,
		)

		if (memberToRemove !== -1) {
			partyState.members.splice(memberToRemove, 1)
		}
	}
}
