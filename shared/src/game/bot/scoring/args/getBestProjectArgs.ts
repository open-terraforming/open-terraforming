import { GameState, PlayerState } from '@shared/index'
import {
	AnyStandardProject,
	StandardProjectArgumentType,
	StandardProjectArgValue,
} from '@shared/projects'
import { pickBest } from '../utils'
import { allCells } from '@shared/utils'
import { canPlace } from '@shared/placements'
import { placeTileScore } from '../place-tile-score'
import { ScoringContext } from '../types'

export const getBestProjectArgs = (
	game: GameState,
	player: PlayerState,
	project: AnyStandardProject,
	scoringContext: ScoringContext,
) => {
	const ctx = { game, player }
	const cost = project.cost(ctx)
	const resource = project.resource
	const playerResource = player[resource]

	if (playerResource < cost) {
		return []
	}

	const args = project.args || []
	const bestValues: StandardProjectArgValue[] = []

	for (const arg of args) {
		switch (arg.type) {
			case StandardProjectArgumentType.CardsInHand: {
				// No cards in hand right now
				bestValues.push([])
				break
			}

			case StandardProjectArgumentType.Tile: {
				const { tilePlacement } = arg

				const bestTile = pickBest(
					allCells(game).filter((c) =>
						canPlace(game, player, c, tilePlacement),
					),
					(c) => placeTileScore(scoringContext, tilePlacement, c),
				)

				// This shouldn't happen, but lets just provide some "sane" value right now
				if (!bestTile) {
					bestValues.push({
						x: -1,
						y: -1,
						location: undefined,
					})

					break
				}

				bestValues.push({
					x: bestTile.x,
					y: bestTile.y,
					location: bestTile.location,
				})

				break
			}
		}
	}

	return bestValues
}
