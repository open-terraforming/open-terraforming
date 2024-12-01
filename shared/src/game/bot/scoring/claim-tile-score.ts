import { GridCell } from '@shared/index'
import { ScoringContext } from './types'
import { adjTilesList } from '@shared/utils/adjTilesList'

export const claimTileScore = (
	{ game, player }: ScoringContext,
	c: GridCell,
) => {
	return (
		adjTilesList(game, c.x, c.y).ownedBy(player.id).hasCity().length * 0.5 +
		c.ore +
		c.cards +
		c.titan +
		c.plants
	)
}
