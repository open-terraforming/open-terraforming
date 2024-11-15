import { SymbolType } from '@shared/cards'
import { drawCards } from '@shared/utils/drawCards'
import { colonyBonus } from '../templates/colonyBonus'

export const colonyDrawCardsBonus = (count: number) =>
	colonyBonus({
		symbols: [{ symbol: SymbolType.Card, count }],
		perform: ({ game, player }) => {
			player.cards.push(...drawCards(game, count))
		},
	})
