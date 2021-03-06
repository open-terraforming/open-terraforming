import { effect } from './types'
import { CardCategory, CardEffectType, Resource, SymbolType } from '../types'
import { updatePlayerProduction, countTagsWithoutEvents } from '../utils'

export const productionForTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number
) => {
	return effect({
		description:
			resPerCard >= 1
				? `Increase your ${res} production by ${resPerCard} per every ${CardCategory[tag]} tag you played (including this if applicable)`
				: `Increase your ${res} production by 1 per every ${Math.ceil(
						1 / resPerCard
				  )} ${
						CardCategory[tag]
				  } tags you played (including this if applicable)`,
		type: CardEffectType.Production,
		symbols: [
			{ tag, count: resPerCard < 1 ? Math.ceil(1 / resPerCard) : 1 },
			{ symbol: SymbolType.RightArrow },
			{
				resource: res,
				production: true,
				count: resPerCard >= 1 ? resPerCard : 1
			}
		],
		perform: ({ player, card }) => {
			updatePlayerProduction(
				player,
				res,
				Math.floor(
					countTagsWithoutEvents([...player.usedCards, card.code], tag) *
						resPerCard
				)
			)
		}
	})
}
