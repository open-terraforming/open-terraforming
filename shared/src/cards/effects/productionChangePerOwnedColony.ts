import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { getPlayerColoniesCount } from '@shared/expansions/colonies/utils/getPlayerColoniesCount'
import { CardEffectType, Resource, SymbolType } from '../types'
import { effect } from './types'

export const productionChangePerOwnedColony = (
	resource: Resource,
	amountPerColony: number,
) =>
	effect({
		type: CardEffectType.Production,
		symbols: [
			{ resource, production: true, count: amountPerColony },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Colony },
		],
		description: `+${amountPerColony} ${resource} production per each colony you own`,
		perform: ({ player, game }) => {
			const colonies = getPlayerColoniesCount({ player, game })

			player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] +=
				amountPerColony * colonies
		},
	})
