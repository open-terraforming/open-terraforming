import { GameState, PlayerState, GridCellContent } from './game'
import { allCells, keyMap, voidReduce, tiles } from './utils'
import { CardsLookupApi, CardCategory, CardType } from './cards'
import { resources, resourceProduction } from './cards/utils'

export enum MilestoneType {
	Terraformer = 1,
	Mayor,
	Gardener,
	Builder,
	Planner,
	Diversifier,
	Tactician,
	PolarExplorer,
	Energizer,
	RimSettler,
	Generalist,
	Specialist,
	Ecologist,
	Tycoon,
	Legend
}

export interface Milestone {
	type: MilestoneType
	title: string
	description: string
	limit: number
	getValue: (game: GameState, player: PlayerState) => number
}

const milestone = (m: Milestone) => m

const MilestonesList = [
	milestone({
		type: MilestoneType.Terraformer,
		title: 'Terraformer',
		description: 'Terraforming rating',
		limit: 35,
		getValue: (_game, player) => player.terraformRating
	}),
	milestone({
		type: MilestoneType.Mayor,
		title: 'Mayor',
		description: 'Cities owned',
		limit: 3,
		getValue: (game, player) =>
			allCells(game).filter(
				c => c.content === GridCellContent.City && c.ownerId === player.id
			).length
	}),
	milestone({
		type: MilestoneType.Gardener,
		title: 'Gardener',
		description: 'Forests owned',
		limit: 3,
		getValue: (game, player) =>
			allCells(game).filter(
				c => c.content === GridCellContent.Forest && c.ownerId === player.id
			).length
	}),
	milestone({
		type: MilestoneType.Builder,
		title: 'Builder',
		description: 'Cards with Building tag played',
		limit: 9,
		getValue: (_game, player) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.filter(c => c.categories.includes(CardCategory.Building)).length
	}),
	milestone({
		type: MilestoneType.Planner,
		title: 'Planner',
		description: 'Cards in your hand',
		limit: 16,
		getValue: (_game, player) =>
			player.cards.filter(
				c => CardsLookupApi.get(c).type !== CardType.Corporation
			).length
	}),
	milestone({
		type: MilestoneType.Diversifier,
		title: 'Diversifier',
		description: 'Different tags in play',
		limit: 6,
		getValue: (_game, player) =>
			Object.keys(
				voidReduce(
					player.usedCards,
					{} as Record<CardCategory, boolean>,
					(acc, c) =>
						CardsLookupApi.get(c.code).categories.forEach(c => {
							if (!acc[c]) {
								acc[c] = true
							}
						})
				)
			).length
	}),
	milestone({
		type: MilestoneType.Tactician,
		title: 'Tactician',
		description: 'Cards with requirements in play',
		limit: 5,
		getValue: (_game, player) =>
			player.usedCards.filter(
				c => CardsLookupApi.get(c.code).conditions.length > 0
			).length
	}),
	milestone({
		type: MilestoneType.PolarExplorer,
		title: 'Polar Explorer',
		description: 'Tiles on the two bottom rows',
		limit: 3,
		getValue: (game, player) =>
			tiles(allCells(game))
				.ownedBy(player.id)
				.c(c => c.y >= game.map.height - 2).length
	}),
	milestone({
		type: MilestoneType.Energizer,
		title: 'Energizer',
		description: 'Energy production',
		limit: 6,
		getValue: (_game, player) => player.energyProduction
	}),
	milestone({
		type: MilestoneType.RimSettler,
		title: 'Rim Settler',
		description: 'Jupiter tags',
		limit: 6,
		getValue: (_game, player) =>
			player.usedCards.reduce(
				(acc, c) =>
					acc +
					CardsLookupApi.get(c.code).categories.filter(
						c => c === CardCategory.Jupiter
					).length,
				0
			)
	}),
	milestone({
		type: MilestoneType.Generalist,
		title: 'Generalist',
		description: 'Resources with production of at least 1',
		limit: 6,
		getValue: (_game, player) =>
			resources.filter(r => player[resourceProduction[r]] > 0).length
	}),
	milestone({
		type: MilestoneType.Specialist,
		title: 'Specialist',
		description: 'Production of any resource',
		limit: 10,
		getValue: (_game, player) =>
			resources.map(r => player[resourceProduction[r]]).sort((a, b) => b - a)[0]
	}),
	milestone({
		type: MilestoneType.Ecologist,
		title: 'Ecologist',
		description: 'Number of bio tags in play (Plant / Microbe / Animal)',
		limit: 4,
		getValue: (_game, player) =>
			player.usedCards.reduce(
				(acc, c) =>
					acc +
					CardsLookupApi.get(c.code).categories.filter(c =>
						[
							CardCategory.Animal,
							CardCategory.Microbe,
							CardCategory.Plant,
							CardCategory.Any
						].includes(c)
					).length,
				0
			)
	}),
	milestone({
		type: MilestoneType.Tycoon,
		title: 'Tycoon',
		description: 'Project cards in play (Green / Blue cards)',
		limit: 15,
		getValue: (_game, player) =>
			player.usedCards.filter(c =>
				[CardType.Action, CardType.Effect, CardType.Building].includes(
					CardsLookupApi.get(c.code).type
				)
			).length
	}),
	milestone({
		type: MilestoneType.Legend,
		title: 'Legend',
		description: 'Event cards in play (Red cards)',
		limit: 5,
		getValue: (_game, player) =>
			player.usedCards.filter(
				c => CardsLookupApi.get(c.code).type === CardType.Event
			).length
	})
]

export const Milestones = keyMap(MilestonesList, 'type')
