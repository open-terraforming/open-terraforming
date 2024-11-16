import { CardCategory, Resource, SymbolType } from '@shared/cards'
import { globalEffect } from '../globalEffect'
import { f } from '@shared/utils/f'
import { withUnits } from '@shared/units'
import {
	countTagsWithoutEvents,
	updatePlayerResource,
} from '@shared/cards/utils'
import { getPlayerInfluence } from '../utils/getPlayerInfluence'

export const resourceChangePerTagGlobalEffect = (
	resource: Resource,
	change: number,
	tag: CardCategory,
) =>
	globalEffect({
		symbols: [
			{ resource, count: change },
			{ symbol: SymbolType.Slash },
			{ tag, affectedByInfluence: true },
		],
		description:
			change < 0
				? f(
						'Lose {0} per {1} tag (max 5, then reduced by influence).',
						withUnits(resource, -change),
						tag,
					)
				: f(
						'Gain {0} per {1} tag (max 5 + influence).',
						withUnits(resource, change),
						tag,
					),
		apply(game) {
			for (const player of game.players) {
				const influence = getPlayerInfluence(game, player)

				const tagCount = Math.min(
					5,
					countTagsWithoutEvents(player.usedCards, tag),
				)

				const changeValue =
					change < 0 ? Math.max(0, tagCount - influence) : tagCount + influence

				if (change < 0 && player[resource] < -changeValue * change) {
					player[resource] = 0
				} else {
					updatePlayerResource(player, resource, changeValue * change)
				}
			}
		},
	})
