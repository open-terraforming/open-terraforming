import { SymbolType } from '@shared/cards'
import { condition } from '@shared/cards/conditions'
import { f } from '@shared/utils'

export const playerHasPartyLeadersCondition = (minCount: number) =>
	condition({
		description:
			minCount === 1
				? 'Requires that you have any party leader.'
				: f('Requires that you have at least {0} party leaders.', minCount),
		symbols: [{ symbol: SymbolType.PartyLeader, count: minCount }],
		evaluate: ({ game, player }) =>
			game.committee.parties.filter((d) => d.leader?.playerId?.id === player.id)
				.length >= minCount,
	})
