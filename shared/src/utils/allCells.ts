import { GameState, GridCell } from '..'

export const allCells = (game: GameState) => {
	return game.map.grid
		.reduce((acc, c) => [...acc, ...c], [] as GridCell[])
		.filter((c) => c.enabled)
}
