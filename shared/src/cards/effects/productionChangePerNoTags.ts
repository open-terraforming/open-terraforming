import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { CardEffectType, CardType, Resource, SymbolType } from '../types'
import { effect } from './types'
import { CardsLookupApi } from '../lookup'

export const productionChangePerNoTags = (
	resource: Resource,
	changePerCard: number,
	includingThis = true,
) =>
	effect({
		type: CardEffectType.Production,
		symbols: [
			{ resource, count: changePerCard, production: true },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.CardWithNoTag },
		],
		description:
			changePerCard > 0
				? `+ ${changePerCard} ${resource} production per card with no tags${includingThis ? `, including this` : ''}`
				: `- ${-changePerCard} ${resource} production per card with no tags${includingThis ? `, including this` : ''}`,
		perform: ({ player }) => {
			const count =
				1 +
				player.usedCards
					.map((c) => CardsLookupApi.get(c.code))
					.filter((c) => c.type !== CardType.Event && c.categories.length === 0)
					.length

			player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] += changePerCard * count
		},
	})
