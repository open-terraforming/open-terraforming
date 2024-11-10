import { CardCategory, SymbolType } from '@shared/cards'
import { globalEvent, GlobalEvent } from './turmoilGlobalEvent'
import { getPlayerInfluence } from './utils/getPlayerInfluence'
import {
	countTagsWithoutEvents,
	updatePlayerProduction,
} from '@shared/cards/utils'

export const turmoilGlobalEvents: GlobalEvent[] = [
	globalEvent({
		code: 'improved_energy_template',
		initialDelegate: 'scientists',
		effectDelegate: 'kelvinists',
		effects: [
			{
				symbols: [
					{ resource: 'energy', production: true },
					{ symbol: SymbolType.Slash },
					{ tag: CardCategory.Power },
					{ tag: CardCategory.Power, affectedByInfluence: true },
				],
				description:
					'Increase energy production by 1 per 2 power tags (no limit). Influence counts as power tags.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const tags = countTagsWithoutEvents(
							player.cards,
							CardCategory.Power,
						)

						updatePlayerProduction(
							player,
							'energy',
							Math.floor(tags / 2) + influence,
						)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'scientific_communities',
		initialDelegate: 'reds',
		effectDelegate: 'scientists',
		effects: [],
	}),
]
