import { SymbolType } from '@shared/cards'
import { committeePartyMemberArg } from '@shared/cards/args'
import { condition } from '@shared/cards/conditions'
import { effect } from '@shared/cards/effects/types'
import { getPartyState } from '../utils/getPartyState'
import { recalculateDominantParty } from '../utils/recalculateDominantParty'
import { recalculatePartyLeader } from '../utils/recalculatePartyLeader'

export const removeDelegateEffect = () =>
	effect({
		description: 'Remove any NON-LEADER delegate',
		symbols: [{ symbol: SymbolType.Delegate, count: -1, other: true }],
		args: [
			{
				...committeePartyMemberArg([(_, party) => party.members.length > 0]),
				descriptionPrefix: 'Remove delegate from',
			},
		],
		conditions: [
			condition({
				evaluate: ({ game }) =>
					game.committee.parties.some((p) => p.members.length > 0),
			}),
		],
		perform({ game }, arg) {
			if (!Array.isArray(arg) || arg.length !== 2) {
				throw new Error(
					'Card argument mismatch - expected array with length of 2. Got ' +
						JSON.stringify(arg),
				)
			}

			const [partyCode, memberPlayerId] = arg

			if (typeof partyCode !== 'string') {
				throw new Error(
					'Card argument mismatch - partyCode to be string, got ' +
						JSON.stringify(partyCode),
				)
			}

			if (typeof memberPlayerId !== 'number' && memberPlayerId !== null) {
				throw new Error(
					'Card argument mismatch - memberPlayerId to be number or null, got ' +
						JSON.stringify(memberPlayerId),
				)
			}

			const party = getPartyState(game, partyCode)

			const delegateIndex = party.members.findIndex(
				(m) => (m.playerId?.id ?? null) === memberPlayerId,
			)

			if (delegateIndex === -1) {
				throw new Error('Delegate not found')
			}

			party.members.splice(delegateIndex, 1)

			recalculatePartyLeader(party)
			recalculateDominantParty(game)
		},
	})
