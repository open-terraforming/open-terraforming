import { GridCell, GridCellContent } from '@shared/index'
import { PlacementState } from '@shared/placements'
import { adjTilesList } from '@shared/utils'
import { ScoringContext } from './types'

export const placeTileScore = (
	{ player, game }: ScoringContext,
	placed: PlacementState,
	c: GridCell,
) => {
	return (
		(placed.type === GridCellContent.Forest
			? adjTilesList(game, c.x, c.y).ownedBy(player.id).hasCity().length -
				adjTilesList(game, c.x, c.y).notOwnedBy(player.id).hasCity().length *
					0.5
			: 0) +
		(c.cards + c.plants + c.ore + c.titan) * 0.5 +
		adjTilesList(game, c.x, c.y).hasOcean().length * 0.3
	)
}
