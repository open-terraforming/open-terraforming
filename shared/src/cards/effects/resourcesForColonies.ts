import { getColoniesCount } from '@shared/expansions/colonies/utils/getColoniesCount'
import { getPlayerColoniesCount } from '@shared/expansions/colonies/utils/getPlayerColoniesCount'
import { withUnits } from '@shared/units'
import { CardEffectType, Resource, SymbolType } from '../types'
import { effect } from './types'
import { colonyCountHint } from '../cardHints'

export const resourcesForColonies = (
	resource: Resource,
	amount: number,
	selfOnly = false,
) =>
	effect({
		type: CardEffectType.Resource,
		description: `Gain ${withUnits(resource, amount)} for each colony${selfOnly ? ' you have' : ' in play'}`,
		symbols: [
			{ resource, count: amount },
			{ symbol: SymbolType.SlashSmall },
			{ symbol: SymbolType.Colony, other: !selfOnly },
		],
		hints: [colonyCountHint({ ownedOnly: selfOnly })],
		perform: ({ player, game }) => {
			player[resource] +=
				(selfOnly
					? getPlayerColoniesCount({ player, game })
					: getColoniesCount({ game })) * amount
		},
	})
