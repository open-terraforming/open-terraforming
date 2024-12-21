import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'
import { CardEffectType, Resource, SymbolType } from '../types'
import { effect } from './types'
import { colonyCountHint } from '../cardHints'

export const productionChangePerColonyInPlay = (
	resource: Resource,
	amountPerColony: number,
) =>
	effect({
		type: CardEffectType.Production,
		symbols: [
			{ resource, production: true, count: amountPerColony },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Colony, other: true },
		],
		hints: [colonyCountHint()],
		description: `+${amountPerColony} ${resource} production per each colony in play`,
		perform: ({ player, game }) => {
			const colonies = getColoniesCount({ game })

			player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] +=
				amountPerColony * colonies
		},
	})
