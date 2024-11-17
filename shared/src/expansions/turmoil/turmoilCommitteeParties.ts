import { CardCategory, SymbolType } from '@shared/cards'
import {
	countTagsWithoutEvents,
	updatePlayerProduction,
	updatePlayerResource,
} from '@shared/cards/utils'
import { GridCellContent, GridCellLocation } from '@shared/index'
import { drawCards } from '@shared/utils/drawCards'
import { committeeParty, CommitteeParty } from './committeeParty'

export const turmoilCommitteeParties: CommitteeParty[] = [
	committeeParty({
		code: 'mars_first',
		bonus: {
			symbols: [
				{ resource: 'money', count: 1 },
				{ symbol: SymbolType.Slash },
				{ tag: CardCategory.Building },
			],
			description: 'Gain 1$ for each building tag',
			apply(game) {
				for (const player of game.players) {
					player.money += countTagsWithoutEvents(
						player.usedCards,
						CardCategory.Building,
					)
				}
			},
		},
		policy: {
			active: [],
			passive: [
				{
					symbols: [
						{ symbol: SymbolType.Tile },
						{ symbol: SymbolType.Colon },
						{ resource: 'ore', count: 1 },
					],
					description: 'Gain 1 ore when placing tile on Mars',
					onTilePlaced({ player, cell }) {
						if (
							cell.location === undefined ||
							cell.location === GridCellLocation.Main
						) {
							updatePlayerResource(player, 'ore', 1)
						}
					},
				},
			],
		},
	}),
	committeeParty({
		code: 'kelvinists',
		bonus: {
			symbols: [
				{ resource: 'money', count: 1 },
				{ symbol: SymbolType.Slash },
				{ resource: 'heat', production: true },
			],
			description: 'Gain 1$ for each heat production',
			apply(game) {
				for (const player of game.players) {
					player.money += player.heatProduction
				}
			},
		},
		policy: {
			active: [
				{
					symbols: [
						{ resource: 'money', count: 10 },
						{ symbol: SymbolType.RightArrow },
						{ resource: 'heat', production: true },
						{ resource: 'energy', production: true },
					],
					description:
						'You can pay $10 to increase your heat and energy production by 1, may be used as many times as you want',
					condition: ({ player }) => player.money >= 10,
					action({ player }) {
						updatePlayerResource(player, 'money', -10)
						updatePlayerProduction(player, 'heat', 1)
						updatePlayerProduction(player, 'energy', 1)
					},
				},
			],
			passive: [],
		},
	}),
	committeeParty({
		code: 'scientists',
		bonus: {
			symbols: [
				{ resource: 'money', count: 1 },
				{ symbol: SymbolType.Slash },
				{ tag: CardCategory.Science },
			],
			description: 'Gain 1$ for each science tag',
			apply(game) {
				for (const player of game.players) {
					player.money += countTagsWithoutEvents(
						player.usedCards,
						CardCategory.Science,
					)
				}
			},
		},
		policy: {
			active: [
				{
					symbols: [
						{ resource: 'money', count: 10 },
						{ symbol: SymbolType.RightArrow },
						{ symbol: SymbolType.Card, count: 3 },
					],
					description:
						'Pay $10 to draw 3 cards, can only be used once per generation per player',
					oncePerGeneration: true,
					condition: ({ player }) => player.money >= 10,
					action({ player, game }) {
						updatePlayerResource(player, 'money', -10)
						player.cards.push(...drawCards(game, 3))
					},
				},
			],
			passive: [],
		},
	}),
	committeeParty({
		code: 'reds',
		bonus: {
			symbols: [],
			description: 'Player(s) with lowest TR gains 1 TR',
			apply(game) {
				const lowestTr = game.players.reduce(
					(lowest, player) =>
						player.terraformRating < lowest ? player.terraformRating : lowest,
					game.players[0].terraformRating,
				)

				game.players
					.filter((player) => player.terraformRating === lowestTr)
					.forEach((player) => {
						player.terraformRating++
					})
			},
		},
		policy: {
			active: [],
			passive: [
				{
					symbols: [
						{ symbol: SymbolType.TerraformingRating },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: -3 },
					],
					description: 'When you gain TR, you lose $3',
					onPlayerRatingChanged({ player }) {
						if (player.money < 3) {
							player.terraformRating--

							return
						}

						updatePlayerResource(player, 'money', -3)
					},
				},
			],
		},
	}),
	committeeParty({
		code: 'unity',
		bonus: {
			symbols: [
				{ resource: 'money', count: 1 },
				{ symbol: SymbolType.Slash },
				{ tag: CardCategory.Earth },
				{ tag: CardCategory.Venus },
				{ tag: CardCategory.Jupiter },
			],
			description: 'Gain 1$ for each Earth, Venus and Jupiter tag',
			apply(game) {
				for (const player of game.players) {
					updatePlayerResource(
						player,
						'money',
						countTagsWithoutEvents(player.usedCards, [
							CardCategory.Earth,
							CardCategory.Venus,
							CardCategory.Jupiter,
						]),
					)
				}
			},
		},
		policy: {
			active: [],
			passive: [
				{
					symbols: [
						{ resource: 'titan' },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: 1, forceCount: true, forceSign: true },
					],
					description: 'Titan is worth $1 more',
					onActivate({ game }) {
						for (const player of game.players) {
							player.titanPrice += 1
						}
					},
					onDeactivate({ game }) {
						for (const player of game.players) {
							player.titanPrice -= 1
						}
					},
				},
			],
		},
	}),
	committeeParty({
		code: 'greens',
		bonus: {
			symbols: [
				{ resource: 'money', count: 1 },
				{ symbol: SymbolType.Slash },
				{ tag: CardCategory.Plant },
				{ tag: CardCategory.Microbe },
				{ tag: CardCategory.Animal },
			],
			description: 'Gain 1$ for each Plant, Microbe and Animal tag',
			apply(game) {
				for (const player of game.players) {
					updatePlayerResource(
						player,
						'money',
						countTagsWithoutEvents(player.usedCards, [
							CardCategory.Plant,
							CardCategory.Microbe,
							CardCategory.Animal,
						]),
					)
				}
			},
		},
		policy: {
			active: [],
			passive: [
				{
					symbols: [
						{ tile: GridCellContent.Forest },
						{ symbol: SymbolType.Colon },
						{ resource: 'money', count: 4 },
					],
					description: 'Gain $4 every time you place a greenery tile',
					onTilePlaced({ player, cell }) {
						if (cell.content === GridCellContent.Forest) {
							updatePlayerResource(player, 'money', 4)
						}
					},
				},
			],
		},
	}),
]
