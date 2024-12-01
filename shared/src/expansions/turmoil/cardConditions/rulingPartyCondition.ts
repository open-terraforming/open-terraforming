import { condition } from '@shared/cards/conditions'
import { f } from '@shared/utils'
import { getPartyState } from '../utils/getPartyState'
import { partyToName } from '../utils/partyToName'
import { getPlayerDelegateCount } from '../utils/getPlayerDelegateCount'

export const rulingPartyCondition = (rulingParty: string) =>
	condition({
		description: f(
			'Requires that {0} are ruling or that you have 2 delegates there.',
			partyToName(rulingParty),
		),
		symbols: [{ committeeParty: rulingParty }],
		evaluate: ({ game, player }) =>
			game.committee.rulingParty === rulingParty ||
			getPlayerDelegateCount(getPartyState(game, rulingParty), player) >= 2,
	})
