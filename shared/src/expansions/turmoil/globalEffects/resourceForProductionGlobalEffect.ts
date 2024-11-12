import { Resource, SymbolType } from '@shared/cards'
import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'
import { withUnits } from '@shared/units'
import { f } from '@shared/utils'
import { globalEffect } from '../globalEffect'
import { getPlayerInfluence } from '../utils/getPlayerInfluence'

export const resourceForProductionGlobalEffect = (
	resource: Resource,
	count: number,
) =>
	globalEffect({
		symbols: [
			{ resource, count },
			{ symbol: SymbolType.Slash },
			{
				resource,
				count: 1,
				production: true,
				affectedByInfluence: true,
			},
		],
		description: f('Gain {0} for each {1} production (max 5) and influence.', [
			withUnits(resource, count),
			resource,
		]),
		apply(game) {
			for (const player of game.players) {
				const influence = getPlayerInfluence(game, player)

				player[resource] +=
					Math.min(5, player[PLAYER_RESOURCE_TO_PRODUCTION[resource]]) +
					influence
			}
		},
	})
