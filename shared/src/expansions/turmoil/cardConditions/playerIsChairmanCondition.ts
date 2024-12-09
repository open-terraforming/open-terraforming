import { SymbolType } from '@shared/cards'
import { condition } from '@shared/cards/conditions'

export const playerIsChairmanCondition = () =>
	condition({
		description: 'Requires that you are the chairman.',
		symbols: [{ symbol: SymbolType.Chairman }],
		evaluate: ({ game, player }) =>
			game.committee.chairman?.playerId?.id === player.id,
	})
