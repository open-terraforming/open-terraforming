import { adjacentCells } from './adjacentCells'
import { GameState } from '..'
import { TileCollection } from './TileCollection'

export const adjTilesList = (game: GameState, x: number, y: number) =>
	new TileCollection(adjacentCells(game, x, y))
