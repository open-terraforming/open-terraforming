import { GameState, PlayerState, GridCellContent } from './game'
import { allCells, keyMap } from './utils'
import { CardsLookupApi, CardCategory, CardType } from './cards'

export enum MilestoneType {
	Terraformer = 1,
	Mayor,
	Gardener,
	Builder,
	Planner
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
	})
]

export const Milestones = keyMap(MilestonesList, 'type')
