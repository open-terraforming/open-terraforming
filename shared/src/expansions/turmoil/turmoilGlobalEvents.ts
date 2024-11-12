import { CardCategory, SymbolType } from '@shared/cards'
import {
	countGridContent,
	countTagsWithoutEvents,
	countUniqueTagsWithoutEvents,
	updatePlayerProduction,
	updatePlayerResource,
} from '@shared/cards/utils'
import { GridCellContent } from '@shared/index'
import { globalEvent, GlobalEvent } from './turmoilGlobalEvent'
import { getPlayerInfluence } from './utils/getPlayerInfluence'
import { adjacentCells, drawCards } from '@shared/utils'
import { resourceChangePerTag } from './globalEffects/resourceChangePerTag'

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
							player.usedCards,
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
		effects: [
			{
				symbols: [
					{ resource: 'money', count: 1 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Card, affectedByInfluence: true },
				],
				description: 'Gain $1 per card in hand (no limit) and influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						player.money += player.cards.length + influence
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'eco_sabotage',
		initialDelegate: 'greens',
		effectDelegate: 'reds',
		effects: [
			{
				symbols: [{ resource: 'plants', count: 3, affectedByInfluence: true }],
				description: 'Lose all except 3 plants + influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						if (player.plants > 3 + influence) {
							updatePlayerResource(player, 'plants', 3 + influence)
						}
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'productivity',
		initialDelegate: 'scientists',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [
					{ resource: 'ore', count: 1 },
					{ symbol: SymbolType.Slash },
					{
						resource: 'ore',
						count: 1,
						production: true,
						affectedByInfluence: true,
					},
				],
				description:
					'Gain 1 ore for each ore production (max 5) and influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						player.ore += Math.min(5, player.oreProduction) + influence
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'red_influence',
		initialDelegate: 'kelvinists',
		effectDelegate: 'reds',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: -3 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.TerraformingRating },
				],
				description: 'Lose $3 for each set of 5 TR over 10 TR (max 5).',
				apply(game) {
					for (const player of game.players) {
						if (player.terraformRating > 10) {
							const trLoss = Math.min(
								5,
								Math.floor((player.terraformRating - 10) / 5),
							)

							player.money = Math.max(0, player.money - trLoss * 3)
						}
					}
				},
			},
			{
				symbols: [
					{ resource: 'money', count: 1, production: true },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Gain $1 production per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						updatePlayerProduction(player, 'money', influence)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'generous_funding',
		initialDelegate: 'kelvinists',
		effectDelegate: 'unity',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: 2 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
					{ symbol: SymbolType.TerraformingRating, count: 5 },
				],
				description:
					'Gain $2 per influence and every set of 5 TR over 15 TR (max 5 sets).',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const trBonus =
							player.terraformRating > 15
								? Math.min(5, Math.floor((player.terraformRating - 15) / 5))
								: 0

						updatePlayerResource(player, 'money', trBonus * influence * 2)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'miners_on_strike',
		initialDelegate: 'mars_first',
		effectDelegate: 'greens',
		effects: [resourceChangePerTag('titan', -1, CardCategory.Jupiter)],
	}),
	globalEvent({
		code: 'asteroid_mining',
		initialDelegate: 'reds',
		effectDelegate: 'unity',
		effects: [resourceChangePerTag('titan', 1, CardCategory.Jupiter)],
	}),
	globalEvent({
		code: 'strong_society',
		initialDelegate: 'reds',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: 5 },
					{ symbol: SymbolType.Slash },
					{ tile: GridCellContent.City, affectedByInfluence: true },
				],
				description: 'Gain $5 per city tile (max 5 + influence).',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const cities = countGridContent(
							game,
							GridCellContent.City,
							player.id,
						)

						const gain = Math.min(5, cities) + influence

						updatePlayerResource(player, 'money', gain)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'diversity',
		initialDelegate: 'scientists',
		effectDelegate: 'scientists',
		effects: [
			{
				symbols: [
					{ tag: CardCategory.Any, count: 9, affectedByInfluence: true },
					{ symbol: SymbolType.Colon },
					{ resource: 'money', count: 10 },
				],
				description:
					'Gain $10 if you have 9 or more different tags. Influence counts as a unique tag.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const uniqueTags = countUniqueTagsWithoutEvents(player.usedCards)

						if (uniqueTags + influence >= 9) {
							updatePlayerResource(player, 'money', 10)
						}
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'interplanetary_trade',
		initialDelegate: 'unity',
		effectDelegate: 'unity',
		effects: [resourceChangePerTag('money', 2, CardCategory.Space)],
	}),
	globalEvent({
		code: 'sabotage',
		initialDelegate: 'unity',
		effectDelegate: 'reds',
		effects: [
			{
				symbols: [
					{ resource: 'energy', count: -1, production: true },
					{ resource: 'ore', count: -1, production: true },
				],
				description: 'Lose 1 energy and 1 ore production.',
				apply(game) {
					for (const player of game.players) {
						updatePlayerProduction(player, 'energy', -1)
						updatePlayerProduction(player, 'ore', -1)
					}
				},
			},
			{
				symbols: [
					{ resource: 'ore', count: 1 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Gain 1 ore per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						updatePlayerResource(player, 'ore', influence)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'snow_cover',
		initialDelegate: 'kelvinists',
		effectDelegate: 'kelvinists',
		effects: [
			{
				symbols: [{ symbol: SymbolType.Temperature, count: -2 }],
				description: 'Decrease temperature by 2 steps.',
				apply(game) {
					game.temperature = Math.max(
						game.map.initialTemperature,
						game.temperature - 2,
					)
				},
			},
			{
				symbols: [
					{ symbol: SymbolType.Card },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Draw 1 card per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						if (influence > 0) {
							player.cards.push(...drawCards(game, influence))
						}
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'mud_slides',
		initialDelegate: 'kelvinists',
		effectDelegate: 'greens',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: -4 },
					{ symbol: SymbolType.Slash },
					{ tile: GridCellContent.Ocean, affectedByInfluence: true },
				],
				description:
					'Lose 4$ for each tile adjacent to ocean (max 5, then reduced by influence).',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						let numberOfCellsAdjacent = 0

						for (const row of game.map.grid) {
							for (const cell of row) {
								if (cell.content === GridCellContent.Ocean) {
									numberOfCellsAdjacent += adjacentCells(
										game,
										cell.x,
										cell.y,
									).filter((cell) => cell.ownerId === player.id).length
								}
							}
						}

						const loss = Math.max(
							0,
							Math.min(5, numberOfCellsAdjacent) - influence,
						)

						player.money = Math.max(0, player.money - loss * 4)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'homeworld_support',
		initialDelegate: 'reds',
		effectDelegate: 'unity',
		effects: [resourceChangePerTag('money', 2, CardCategory.Earth)],
	}),
	globalEvent({
		code: 'solar_flare',
		initialDelegate: 'unity',
		effectDelegate: 'kelvinists',
		effects: [resourceChangePerTag('money', -3, CardCategory.Space)],
	}),
	globalEvent({
		code: 'spin_off_products',
		initialDelegate: 'greens',
		effectDelegate: 'scientists',
		effects: [resourceChangePerTag('money', 2, CardCategory.Science)],
	}),
]
