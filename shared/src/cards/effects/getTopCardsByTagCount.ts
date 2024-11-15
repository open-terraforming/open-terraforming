import { drawCards } from '@shared/utils/drawCards'
import { CardCategory, SymbolType } from '../types'
import { countTagsWithoutEvents } from '../utils'
import { effect } from './types'
import { CardsLookupApi } from '../lookup'

export const getTopCardsByTagCount = (
	tag: CardCategory,
	tagCountPerCard: number,
) =>
	effect({
		description: `Draw 1 card for every ${tagCountPerCard} ${CardCategory[tag]} tags you have, including this`,
		symbols: [
			{ symbol: SymbolType.Card },
			{ symbol: SymbolType.Slash },
			{ tag, count: tagCountPerCard },
		],
		perform: ({ card, player, game }) => {
			const thisCardCount = CardsLookupApi.get(card.code).categories.filter(
				(cat) => cat === tag,
			).length

			const tagCount =
				countTagsWithoutEvents(player.usedCards, tag) + thisCardCount

			const cards = drawCards(game, Math.floor(tagCount / tagCountPerCard))

			player.cards.push(...cards)
		},
	})
