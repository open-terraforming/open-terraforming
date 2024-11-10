import { CardCategory, SymbolType } from '@shared/cards'
import {
	countTagsWithoutEvents,
	updatePlayerProduction,
	updatePlayerResource,
} from '@shared/cards/utils'
import { GridCellContent, GridCellLocation } from '@shared/index'
import { drawCards } from '@shared/utils'
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
			apply(game) {
				for (const player of game.players) {
					player.money += countTagsWithoutEvents(
						player.cards,
						CardCategory.Building,
					)
				}
			},
		},
		policy: {
			active: [],
			passive: [
				{
					symbols: [],
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
			apply(game) {
				for (const player of game.players) {
					player.money += countTagsWithoutEvents(
						player.cards,
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
						{ symbol: SymbolType.Card },
						{ symbol: SymbolType.Card },
						{ symbol: SymbolType.Card },
					],
					description:
						'Pay $10 to draw 3 cards, can only be used once per generation per player',
					oncePerGeneration: true,
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
						{ symbol: SymbolType.RightArrow },
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
			apply(game) {
				for (const player of game.players) {
					updatePlayerResource(
						player,
						'money',
						countTagsWithoutEvents(player.cards, [
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
						{ resource: 'money', count: 1 },
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
			apply(game) {
				for (const player of game.players) {
					updatePlayerResource(
						player,
						'money',
						countTagsWithoutEvents(player.cards, [
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
