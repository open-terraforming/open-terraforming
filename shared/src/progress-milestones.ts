import {
	GridCellContent,
	GameState,
	PlayerState,
	ProgressMilestoneType,
} from './game'
import { keyMap } from './utils'

export interface ProgressMilestone {
	type: ProgressMilestoneType
	effects: ((game: GameState, player: PlayerState) => void)[]
}

const milestone = (m: ProgressMilestone): ProgressMilestone => m

const ProgressMilestonesList = [
	milestone({
		type: ProgressMilestoneType.Heat,
		effects: [(_game, player) => (player.heatProduction += 1)],
	}),
	milestone({
		type: ProgressMilestoneType.Temperature,
		effects: [
			(game, player) => {
				if (game.temperature < game.map.temperature) {
					player.terraformRating++
					game.temperature++
				}
			},
		],
	}),
	milestone({
		type: ProgressMilestoneType.Ocean,
		effects: [
			(game, player) => {
				if (game.oceans < game.map.oceans) {
					player.placingTile.push({
						type: GridCellContent.Ocean,
					})
				}
			},
		],
	}),
]

export const ProgressMilestones = keyMap(ProgressMilestonesList, 'type')