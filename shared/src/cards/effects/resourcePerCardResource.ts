import { withUnits } from '@shared/units'
import { CardEffectType, CardResource, Resource, SymbolType } from '../types'
import { effect } from './types'

export const resourcePerCardResource = (
	resource: Resource,
	count: number,
	cardResource: CardResource,
	maxCount?: number,
) =>
	effect({
		type: CardEffectType.Resource,
		description: `+ ${count} ${resource} per ${withUnits(cardResource, 1)} on this card${maxCount ? ` (max ${maxCount})` : ''}`,
		symbols: [
			{ resource, count },
			{ symbol: SymbolType.SlashSmall },
			{ cardResource },
		],
		conditions: [
			{
				symbols: [{ cardResource }],
				evaluate: ({ card }) => {
					return card[cardResource] > 0
				},
			},
		],
		perform: ({ player, card }) => {
			const resourcesCount = Math.min(maxCount ?? Infinity, card[cardResource])

			player[resource] += resourcesCount * count
			card[cardResource] -= resourcesCount
		},
	})
