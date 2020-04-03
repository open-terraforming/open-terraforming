import { GameState, PlayerState, GridCellType, GridCellContent } from './game'
import { allCells, keyMap } from './utils'

export enum MilestoneType {
	Terraformer = 1,
	Mayor,
	Gardener,
	Builder,
	Planner,
}

export interface Milestone {
	type: MilestoneType
	description: string
	limit: number
	condition: (game: GameState, player: PlayerState) => boolean
}

const milestone = (m: Milestone) => m

const MilestonesList = [
	milestone({
		type: MilestoneType.Terraformer,
		description: 'Terraformer',
		limit: 35,
		condition: (_game, player) => player.gameState.terraformRating >= 35,
	}),
	milestone({
		type: MilestoneType.Mayor,
		description: 'Mayor',
		limit: 3,
		condition: (game, player) =>
			allCells(game).filter(
				(c) => c.content === GridCellContent.City && c.ownerId === player.id
			).length >= 3,
	}),
	milestone({
		type: MilestoneType.Gardener,
		description: 'Gardener',
		limit: 3,
		condition: (game, player) =>
			allCells(game).filter(
				(c) => c.content === GridCellContent.Forest && c.ownerId === player.id
			).length >= 3,
	}),
	milestone({
		type: MilestoneType.Builder,
		description: 'Builder',
		limit: 9,
		condition: (game, player) =>
			allCells(game).filter(
				(c) => c.content === GridCellContent.Other && c.ownerId === player.id
			).length >= 3,
	}),
	milestone({
		type: MilestoneType.Planner,
		description: 'Planner',
		limit: 16,
		condition: (_game, player) => player.gameState.cards.length >= 16,
	}),
]

export const Milestones = keyMap(MilestonesList, 'type')
