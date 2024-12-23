import {
	GridCellContent,
	GameState,
	PlayerState,
	ProgressMilestoneType,
} from './gameState'
import { drawCards } from './utils/drawCards'
import { pushPendingAction } from './utils/pushPendingAction'
import { keyMap } from './utils/keyMap'
import { placeTileAction } from './player-actions'

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
					player.terraformRatingIncreasedThisGeneration = true
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
					pushPendingAction(
						player,
						placeTileAction({
							type: GridCellContent.Ocean,
						}),
					)
				}
			},
		],
	}),
	milestone({
		type: ProgressMilestoneType.Card,
		effects: [
			(game, player) => {
				player.cards.push(...drawCards(game, 1))
			},
		],
	}),
	milestone({
		type: ProgressMilestoneType.TerraformingRating,
		effects: [
			(game, player) => {
				player.terraformRating++
				player.terraformRatingIncreasedThisGeneration = true
			},
		],
	}),
]

export const ProgressMilestones = keyMap(ProgressMilestonesList, 'type')
