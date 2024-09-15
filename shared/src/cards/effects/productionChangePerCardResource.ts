import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { CardsLookupApi } from '../lookup'
import { CardEffectType, CardResource, Resource, SymbolType } from '../types'
import { effect } from './types'

export const productionChangePerCardResource = (
	resource: Resource,
	cardResource: CardResource,
	cardResourceCountPerOneProduction: number,
) =>
	effect({
		type: CardEffectType.Production,
		symbols: [
			{ resource, production: true },
			{ symbol: SymbolType.Slash },
			{ cardResource, count: cardResourceCountPerOneProduction },
		],
		description: `+ 1 ${resource} production per ${cardResourceCountPerOneProduction} ${cardResource} you have`,
		perform: ({ player }) => {
			const resources = player.usedCards.reduce((acc, c) => {
				const info = CardsLookupApi.get(c.code)

				if (info.resource === cardResource) {
					acc += c[cardResource]
				}

				return acc
			}, 0)

			const production = Math.floor(
				resources / cardResourceCountPerOneProduction,
			)

			player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] += production
		},
	})
