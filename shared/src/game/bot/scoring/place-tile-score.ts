import { GridCell, GridCellContent } from '@shared/index'
import { PlacementState } from '@shared/placements'
import { adjTilesList } from '@shared/utils'
import { ScoringContext } from './types'

export const placeTileScore = (
	{ player, game, scoring }: ScoringContext,
	placed: PlacementState,
	c: GridCell,
) => {
	const oceansMoney =
		adjTilesList(game, c.x, c.y).hasOcean().length * scoring.resources.money

	const cellResources =
		c.cards * scoring.cardCount +
		c.plants * scoring.resources.plants +
		c.ore * scoring.resources.ore +
		c.titan * scoring.resources.titan +
		c.heat *
			(game.temperature < game.map.temperature
				? scoring.resources.heatWhenBelowGlobalTemperature
				: scoring.resources.heatWhenAboveGlobalTemperature) +
		(game.oceans < game.map.oceans ? c.oceans * scoring.terraformingRating : 0)

	const baseScore = oceansMoney + cellResources

	switch (placed.type) {
		case GridCellContent.Forest:
			return (
				baseScore +
				scoring.tileVictoryPoints +
				(game.oxygen < game.map.oxygen ? scoring.terraformingRating : 0) +
				adjTilesList(game, c.x, c.y).ownedBy(player.id).hasCity().length *
					scoring.tileVictoryPoints -
				adjTilesList(game, c.x, c.y).notOwnedBy(player.id).hasCity().length *
					scoring.tileVictoryPoints *
					0.5
			)
		case GridCellContent.City:
			return (
				baseScore +
				adjTilesList(game, c.x, c.y).hasGreenery().length *
					scoring.tileVictoryPoints
			)
		case GridCellContent.Ocean:
			return (
				baseScore +
				(game.oceans < game.map.oceans ? scoring.terraformingRating : 0)
			)
	}

	return baseScore
}
