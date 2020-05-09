import { Resource } from '@shared/cards'
import {
	GameState,
	GridCell,
	GridCellContent,
	PlayerState
} from '@shared/index'
import { PlacementState } from '@shared/placements'
import { adjTilesList } from '@shared/utils'

export type PlacementReward = {
	resource: 'vp' | Resource
	count: number
	description: string
}

export const getPlaceRewards = (
	game: GameState,
	player: PlayerState,
	placing: PlacementState,
	cell: GridCell
) => {
	const rewards = [] as PlacementReward[]

	if (placing.type === GridCellContent.City) {
		rewards.push({
			resource: 'vp',
			count: adjTilesList(game, cell.x, cell.y).hasGreenery().length,
			description: 'for adjusted Greeneries'
		})
	}

	if (placing.type === GridCellContent.Forest) {
		rewards.push({
			resource: 'vp',
			count: 1,
			description: 'for placing Greenery'
		})

		rewards.push({
			resource: 'vp',
			count: adjTilesList(game, cell.x, cell.y)
				.hasCity()
				.ownedBy(player.id).length,
			description: 'for adjusted owned Cities'
		})
	}

	rewards.push({
		resource: 'money',
		count: adjTilesList(game, cell.x, cell.y).hasOcean().length * 2,
		description: 'for adjusted Oceans'
	})

	return rewards.filter(r => r.count !== 0)
}
