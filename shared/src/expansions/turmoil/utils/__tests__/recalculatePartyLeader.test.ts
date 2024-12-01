import { CommitteePartyState } from '@shared/index'
import { recalculatePartyLeader } from '../recalculatePartyLeader'

describe(recalculatePartyLeader.name, () => {
	it('replaces null leader when new member is added', () => {
		const party: CommitteePartyState = {
			code: 'greens',
			leader: null,
			members: [],
		}

		party.members.push({
			playerId: { id: 1 },
		})

		recalculatePartyLeader(party)

		expect(party.leader).toEqual({ playerId: { id: 1 } })
		expect(party.members).toHaveLength(0)
	})

	it('replaces leader when new member is added', () => {
		const party: CommitteePartyState = {
			code: 'greens',
			leader: { playerId: { id: 2 } },
			members: [],
		}

		party.members.push({ playerId: { id: 1 } }, { playerId: { id: 1 } })

		recalculatePartyLeader(party)

		expect(party.leader).toEqual({ playerId: { id: 1 } })
		expect(party.members).toHaveLength(2)
		expect(party.members.filter((p) => p.playerId?.id === 1)).toHaveLength(1)
		expect(party.members.filter((p) => p.playerId?.id === 2)).toHaveLength(1)
	})

	it('keeps leader for tie', () => {
		const party: CommitteePartyState = {
			code: 'greens',
			leader: { playerId: { id: 2 } },
			members: [],
		}

		party.members.push({ playerId: { id: 1 } })

		recalculatePartyLeader(party)

		expect(party.leader).toEqual({ playerId: { id: 2 } })
		expect(party.members).toHaveLength(1)
		expect(party.members.filter((p) => p.playerId?.id === 1)).toHaveLength(1)
	})

	it('replaces leader when new member is added', () => {
		const party: CommitteePartyState = {
			code: 'greens',
			leader: { playerId: null },
			members: [],
		}

		party.members.push({ playerId: { id: 1 } }, { playerId: { id: 1 } })

		recalculatePartyLeader(party)

		expect(party.leader).toEqual({ playerId: { id: 1 } })
		expect(party.members).toHaveLength(2)
		expect(party.members.filter((p) => p.playerId?.id === 1)).toHaveLength(1)
		expect(party.members.filter((p) => p.playerId === null)).toHaveLength(1)
	})
})
