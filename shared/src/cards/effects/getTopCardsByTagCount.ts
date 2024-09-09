import { drawCards } from '@shared/utils'
import { CardCategory, SymbolType } from '../types'
import { countTagsWithoutEvents } from '../utils'
import { effect } from './types'

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
		perform: ({ player, game }) => {
			const tagCount = countTagsWithoutEvents(player.cards, tag)
			const cards = drawCards(game, Math.floor(tagCount / tagCountPerCard))

			player.cards.push(...cards)
		},
	})
