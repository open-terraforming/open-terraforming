import { Resource, SymbolType } from '@shared/cards'
import { withUnits } from '@shared/units'
import { f } from '@shared/utils/f'
import { globalEffect } from '../globalEffect'
import { getPlayerInfluence } from '../utils/getPlayerInfluence'

export const resourceForInfluenceGlobalEffect = (
	resource: Resource,
	count: number,
) =>
	globalEffect({
		symbols: [
			{ resource, count },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Influence },
		],
		description: f(
			'Gain {0} for each influence.',
			withUnits(resource, count),
			resource,
		),
		apply(game) {
			for (const player of game.players) {
				const influence = getPlayerInfluence(game, player)
				player[resource] += influence
			}
		},
	})
