import { allCells } from './allCells'
import { GameState } from '..'
import { TileCollection } from './TileCollection'

export const allTiles = (game: GameState) => new TileCollection(allCells(game))
