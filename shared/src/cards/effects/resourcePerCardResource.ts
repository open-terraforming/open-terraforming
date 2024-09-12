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
		description: `+ ${count} ${resource} per ${cardResource} on this card${maxCount ? ` (max ${maxCount})` : ''}`,
		symbols: [
			{ resource, count },
			{ symbol: SymbolType.Slash },
			{ cardResource },
		],
		perform: ({ player, card }) => {
			const resourcesCount = Math.min(maxCount ?? Infinity, card[cardResource])

			player[resource] += resourcesCount * count
			card[cardResource] -= resourcesCount
		},
	})
