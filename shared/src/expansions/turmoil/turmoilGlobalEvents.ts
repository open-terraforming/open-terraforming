import {
	CardCategory,
	CardsLookupApi,
	CardSpecial,
	CardType,
	SymbolType,
} from '@shared/cards'
import {
	countGridContent,
	countTagsWithoutEvents,
	countUniqueTagsWithoutEvents,
	updatePlayerProduction,
	updatePlayerResource,
} from '@shared/cards/utils'
import { GridCellContent } from '@shared/index'
import { discardCardsAction, placeTileAction } from '@shared/player-actions'
import { adjacentCells } from '@shared/utils/adjacentCells'
import { drawCardPerInfluenceGlobalEffect } from './globalEffects/drawCardPerInfluenceGlobalEffect'
import { resourceChangePerTagGlobalEffect } from './globalEffects/resourceChangePerTagGlobalEffect'
import { resourceForProductionGlobalEffect } from './globalEffects/resourceForProductionGlobalEffect'
import { globalEvent, GlobalEvent } from './globalEvent'
import { getPlayerInfluence } from './utils/getPlayerInfluence'
import { evaluateCompetition } from '@shared/utils/evaluateCompetition'
import { getPlayerColoniesCount } from '../colonies/utils/getPlayerColoniesCount'
import { resourceForInfluenceGlobalEffect } from './globalEffects/resourceForInfluenceGlobalEffect'

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
		effects: [resourceForProductionGlobalEffect('ore', 1)],
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
				description: 'Lose 3$ for each set of 5 TR over 10 TR (max 5).',
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
				description: 'Gain 1$ production per influence.',
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
					{ symbol: SymbolType.Plus },
					{ symbol: SymbolType.TerraformingRating, count: 5 },
				],
				description:
					'Gain 2 per influence and every set of 5 TR over 15 TR (max 5 sets).',
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
		effects: [
			resourceChangePerTagGlobalEffect('titan', -1, CardCategory.Jupiter),
		],
	}),
	globalEvent({
		code: 'asteroid_mining',
		initialDelegate: 'reds',
		effectDelegate: 'unity',
		effects: [
			resourceChangePerTagGlobalEffect('titan', 1, CardCategory.Jupiter),
		],
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
				description: 'Gain 5$ per city tile (max 5 + influence).',
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
					'Gain 10$ if you have 9 or more different tags. Influence counts as a unique tag.',
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
		effects: [resourceChangePerTagGlobalEffect('money', 2, CardCategory.Space)],
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
			drawCardPerInfluenceGlobalEffect(),
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
		effects: [resourceChangePerTagGlobalEffect('money', 2, CardCategory.Earth)],
	}),
	globalEvent({
		code: 'solar_flare',
		initialDelegate: 'unity',
		effectDelegate: 'kelvinists',
		effects: [
			resourceChangePerTagGlobalEffect('money', -3, CardCategory.Space),
		],
	}),
	globalEvent({
		code: 'spin_off_products',
		initialDelegate: 'greens',
		effectDelegate: 'scientists',
		effects: [
			resourceChangePerTagGlobalEffect('money', 2, CardCategory.Science),
		],
	}),
	globalEvent({
		code: 'war_on_earth',
		initialDelegate: 'mars_first',
		effectDelegate: 'kelvinists',
		effects: [
			{
				symbols: [
					{
						symbol: SymbolType.TerraformingRating,
						count: -4,
						affectedByInfluence: true,
					},
				],
				description: 'Lose 4 TR, reduced by influence',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						player.terraformRating = Math.max(
							0,
							player.terraformRating - Math.max(0, 4 - influence),
						)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'global_dust_storm',
		initialDelegate: 'kelvinists',
		effectDelegate: 'greens',
		effects: [
			{
				symbols: [{ resource: 'heat', count: -99 }],
				description: 'Lose all heat.',
				apply(game) {
					for (const player of game.players) {
						player.heat = 0
					}
				},
			},
			resourceChangePerTagGlobalEffect('money', -2, CardCategory.Building),
		],
	}),
	globalEvent({
		code: 'sponsored_projects',
		initialDelegate: 'scientists',
		effectDelegate: 'greens',
		effects: [
			{
				symbols: [
					{ symbol: SymbolType.Card },
					{ symbol: SymbolType.Colon },
					{ symbol: SymbolType.AnyResource, count: 1 },
				],
				description: 'Every card with resources on it gains 1 resource.',
				apply(game) {
					for (const player of game.players) {
						for (const card of player.usedCards) {
							const info = CardsLookupApi.get(card.code)

							// TODO: Should cards with that accept resource but have no resource on them count?
							if (info.resource) {
								card[info.resource]++
							}
						}
					}
				},
			},
			drawCardPerInfluenceGlobalEffect(),
		],
	}),
	globalEvent({
		code: 'pandemic',
		initialDelegate: 'greens',
		effectDelegate: 'mars_first',
		effects: [
			resourceChangePerTagGlobalEffect('money', -3, CardCategory.Building),
		],
	}),
	globalEvent({
		code: 'successful_organisms',
		initialDelegate: 'mars_first',
		effectDelegate: 'scientists',
		effects: [resourceForProductionGlobalEffect('plants', 1)],
	}),
	globalEvent({
		code: 'paradigm_breakdown',
		initialDelegate: 'mars_first',
		effectDelegate: 'scientists',
		effects: [
			{
				symbols: [{ symbol: SymbolType.Card, count: -2 }],
				description: 'Discard 2 cards from hand.',
				apply(game) {
					for (const player of game.players) {
						player.pendingActions.push(discardCardsAction(2))
					}
				},
			},
			{
				symbols: [
					{ resource: 'money', count: 2 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Gain 2$ per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						updatePlayerResource(player, 'money', influence * 2)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'revolution',
		initialDelegate: 'unity',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [
					{ tag: CardCategory.Earth },
					{ symbol: SymbolType.Plus },
					{ symbol: SymbolType.Influence },
					{ symbol: SymbolType.Colon },
					{ symbol: SymbolType.TerraformingRating, count: -2 },
					{ symbol: SymbolType.SlashSmall },
					{ symbol: SymbolType.TerraformingRating, count: -1 },
				],
				description:
					'Count Earth tags and add influence. Player with most (at least 1) loses 2 TR and 2nd most (at least 1) loses 1 TR. Solo: Lose 2 TR if sum is 4 or more',
				apply(game) {
					// Solo has different rules
					if (game.players.length === 1) {
						if (
							countTagsWithoutEvents(
								game.players[0].usedCards,
								CardCategory.Earth,
							) >= 4
						) {
							game.players[0].terraformRating -= 2
						}

						return
					}

					const {
						first: firstPlayers,
						firstCount,
						second: secondPlayers,
						secondCount,
					} = evaluateCompetition(
						game.players.map((player) => ({
							item: player,
							count:
								countTagsWithoutEvents(player.usedCards, CardCategory.Earth) +
								getPlayerInfluence(game, player),
						})),
					)

					// At least 1 tag is required for first and second place
					if (firstCount < 1) {
						return
					}

					firstPlayers.forEach((p) => (p.item.terraformRating -= 2))

					// At least 1 tag is required for first and second place
					if (!secondCount || secondCount < 1) {
						return
					}

					secondPlayers.forEach((p) => (p.item.terraformRating -= 1))
				},
			},
		],
	}),
	globalEvent({
		code: 'solarnet_shutdown',
		initialDelegate: 'scientists',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: -3 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.BlueCard, affectedByInfluence: true },
				],
				description:
					'Lose 3$ per blue card (max 5, then reduced by and influence).',
				apply(game) {
					for (const player of game.players) {
						const blueCards = player.usedCards
							.map((c) => CardsLookupApi.get(c.code))
							.filter((c) => c.type === CardType.Action).length

						const influence = getPlayerInfluence(game, player)
						const loss = Math.max(0, Math.min(5, blueCards) - influence)

						player.money = Math.max(0, player.money - loss * 3)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'volcanic_eruptions',
		initialDelegate: 'scientists',
		effectDelegate: 'kelvinists',
		effects: [
			{
				symbols: [{ symbol: SymbolType.Temperature, count: 2 }],
				description: 'Increase temperature by 2 steps.',
				apply(game) {
					game.temperature = Math.min(
						game.map.temperature,
						game.temperature + 2,
					)
				},
			},
			{
				symbols: [
					{ resource: 'heat', production: true, count: 1 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Gain 1 heat production per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						updatePlayerProduction(player, 'heat', influence)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'celebrity_leaders',
		initialDelegate: 'unity',
		effectDelegate: 'greens',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: 2 },
					{ symbol: SymbolType.Slash },
					{ tag: CardCategory.Event, affectedByInfluence: true },
				],
				description: 'Gain 2$ per event card (max 5 + influence).',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const events = player.usedCards
							.map((c) => CardsLookupApi.get(c.code))
							.filter((c) => c.type === CardType.Event).length

						const gain = Math.min(5, events) + influence

						updatePlayerResource(player, 'money', gain * 2)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'riots',
		initialDelegate: 'mars_first',
		effectDelegate: 'reds',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: -4 },
					{ symbol: SymbolType.Slash },
					{ tile: GridCellContent.City, affectedByInfluence: true },
				],
				description:
					'Lose 4$ for each city tile (max 5, then reduced by influence).',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						const cities = countGridContent(
							game,
							GridCellContent.City,
							player.id,
						)

						const loss = Math.max(0, Math.min(5, cities) - influence)

						player.money = Math.max(0, player.money - loss * 4)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'aquifer_released_by_public_council',
		initialDelegate: 'greens',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [{ tile: GridCellContent.Ocean }],
				description: 'First player places an ocean tile.',
				apply(game) {
					if (game.oceans >= game.map.oceans) {
						return
					}

					const firstPlayer = game.players[game.currentPlayer]

					firstPlayer.pendingActions.push(
						placeTileAction({ type: GridCellContent.Ocean }, true),
					)
				},
			},
			{
				symbols: [
					{ resource: 'plants', count: 1 },
					{ resource: 'ore', count: 1 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Influence },
				],
				description: 'Gain 1 plant and 1 ore per influence.',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)
						updatePlayerResource(player, 'plants', influence)
						updatePlayerResource(player, 'ore', influence)
					}
				},
			},
		],
	}),
	globalEvent({
		code: 'election',
		initialDelegate: 'greens',
		effectDelegate: 'mars_first',
		effects: [
			{
				symbols: [
					{ symbol: SymbolType.Influence },
					{ symbol: SymbolType.Plus },
					{ tag: CardCategory.Building },
					{ symbol: SymbolType.Plus },
					{ tile: GridCellContent.City },
					{ symbol: SymbolType.Colon },
					{ symbol: SymbolType.TerraformingRating, count: 2 },
					{ symbol: SymbolType.SlashSmall },
					{ symbol: SymbolType.TerraformingRating, count: 1 },
				],
				description:
					'Count influence + number of building tags + number of city tiles. Player with the biggest count gains 2 TR, 2nd biggest gains 1 TR. SOLO: Gain 2 TR if count is 10 or more.',
				apply(game) {
					if (game.players.length === 0) {
						const count =
							countTagsWithoutEvents(
								game.players[0].usedCards,
								CardCategory.Building,
							) +
							getPlayerInfluence(game, game.players[0]) +
							countGridContent(game, GridCellContent.City, game.players[0].id)

						if (count >= 10) {
							game.players[0].terraformRating += 2
						}

						return
					}

					const { first: firstPlayers, second: secondPlayers } =
						evaluateCompetition(
							game.players.map((player) => ({
								item: player,
								count:
									countTagsWithoutEvents(
										player.usedCards,
										CardCategory.Building,
									) +
									getPlayerInfluence(game, player) +
									countGridContent(game, GridCellContent.City, player.id),
							})),
						)

					firstPlayers.forEach((p) => (p.item.terraformRating += 2))
					secondPlayers.forEach((p) => (p.item.terraformRating += 1))
				},
			},
		],
	}),
	globalEvent({
		code: 'venus_infrastructure',
		initialDelegate: 'mars_first',
		effectDelegate: 'unity',
		effects: [resourceChangePerTagGlobalEffect('money', 2, CardCategory.Venus)],
		special: [CardSpecial.Venus],
	}),
	globalEvent({
		code: 'jovian_tax_rights',
		initialDelegate: 'scientists',
		effectDelegate: 'unity',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: 1, production: true },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Colony },
				],
				description: 'Gain 1$ production per colony.',
				apply(game) {
					for (const player of game.players) {
						const colonies = getPlayerColoniesCount({ game, player })

						updatePlayerProduction(player, 'money', colonies)
					}
				},
			},
			resourceForInfluenceGlobalEffect('titan', 1),
		],
		special: [CardSpecial.Colonies],
	}),
	globalEvent({
		code: 'microgravity_health_problems',
		initialDelegate: 'mars_first',
		effectDelegate: 'scientists',
		effects: [
			{
				symbols: [
					{ resource: 'money', count: -3 },
					{ symbol: SymbolType.Slash },
					{ symbol: SymbolType.Colony, affectedByInfluence: true },
				],
				description: 'Lose 3$ per colony (max 5, then reduced by influence).',
				apply(game) {
					for (const player of game.players) {
						const colonies = getPlayerColoniesCount({ game, player })
						const influence = getPlayerInfluence(game, player)

						const loss = Math.max(0, Math.min(5, colonies) - influence)

						player.money = Math.max(0, player.money - loss * 3)
					}
				},
			},
		],
		special: [CardSpecial.Colonies],
	}),
	globalEvent({
		code: 'cloud_societies',
		initialDelegate: 'unity',
		effectDelegate: 'reds',
		special: [CardSpecial.Venus],
		effects: [
			{
				symbols: [
					{ symbol: SymbolType.Card },
					{ symbol: SymbolType.Colon },
					{ cardResource: 'floaters', affectedByInfluence: true },
				],
				description:
					'Add 1 floater (+1 for each influence) to every card that accepts floaters',
				apply(game) {
					for (const player of game.players) {
						const influence = getPlayerInfluence(game, player)

						for (const card of player.usedCards) {
							const info = CardsLookupApi.get(card.code)

							if (info.resource === 'floaters') {
								card.floaters += 1 + influence
							}
						}
					}
				},
			},
		],
	}),
	/*
	TODO: Implement the effect? Is it worth it?
	globalEvent({
		code: 'corrosive_rain',
		initialDelegate: 'kelvinists',
		effectDelegate: 'greens',
		special: [CardSpecial.Venus],
		effects: [
			// TODO: Lose 2 floaters from a card OR lose 10$
			drawCardPerInfluenceGlobalEffect(),
		],
	}),
	*/
]
