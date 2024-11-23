import { SymbolType } from '@shared/cards'
import { committeePartyArg } from '@shared/cards/args'
import { effect } from '@shared/cards/effects/types'
import { anyPartyHasNeutralDelegateCondition } from '../cardConditions/anyPartyHasNeutralDelegateCondition'
import { playerHasDelegateInReserveCondition } from '../cardConditions/playerHasDelegateInReserveCondition'
import { getPartyState } from '../utils/getPartyState'
import { recalculateDominantParty } from '../utils/recalculateDominantParty'
import { recalculatePartyLeader } from '../utils/recalculatePartyLeader'

export const replaceNeutralMemberEffect = () =>
	effect({
		description:
			'Replace a neutral non-leader member with your delegate from reserve',
		symbols: [
			{ symbol: SymbolType.Delegate, count: -1, forceSign: true },
			{ symbol: SymbolType.Delegate, count: 1, forceSign: true },
		],
		conditions: [
			anyPartyHasNeutralDelegateCondition(),
			playerHasDelegateInReserveCondition(),
		],
		args: [
			committeePartyArg([
				(_, party) => party.members.some((m) => m.playerId === null),
			]),
		],
		perform: ({ game, player }, partyCode) => {
			if (typeof partyCode !== 'string') {
				throw new Error(
					'Card argument mismatch - partyCode to be string, got ' +
						JSON.stringify(partyCode),
				)
			}

			const party = getPartyState(game, partyCode)
			const neutralIndex = party.members.findIndex((m) => m.playerId === null)

			if (neutralIndex === -1) {
				throw new Error('No neutral member found')
			}

			const reserveIndex = game.committee.reserve.findIndex(
				(delegate) => delegate?.id === player.id,
			)

			if (reserveIndex < 0) {
				throw new Error('No reserve delegate found')
			}

			// Remove player delegate from reserve and return neutral member to reserve
			game.committee.reserve.splice(reserveIndex, 1)
			game.committee.reserve.push(null)

			// Add player member
			party.members[neutralIndex] = { playerId: { id: player.id } }

			recalculatePartyLeader(party)
			recalculateDominantParty(game)
		},
	})
