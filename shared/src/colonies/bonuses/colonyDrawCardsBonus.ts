import { SymbolType } from '@shared/cards'
import { drawCards } from '@shared/utils'
import { colonyBonus } from '../utils'

export const colonyDrawCardsBonus = (count: number) =>
	colonyBonus({
		symbols: [{ symbol: SymbolType.Card, count }],
		perform: ({ game, player }) => {
			player.cards.push(...drawCards(game, count))
		},
	})