import { condition } from '@shared/cards/conditions'
import { f, ucFirst } from '@shared/utils'
import { getPartyState } from '../utils/getPartyState'

export const rulingPartyCondition = (rulingParty: string) =>
	condition({
		description: f(
			'Requires that {0} are ruling or that you have 2 delegates there.',
			ucFirst(rulingParty),
		),
		// TODO: Symbols for parties
		symbols: [{ committeeParty: rulingParty }],
		evaluate: ({ game, player }) =>
			game.committee.rulingParty === rulingParty ||
			getPartyState(game, rulingParty).members.filter(
				(d) => d.playerId?.id === player.id,
			).length >= 2,
	})
