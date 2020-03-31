import { GameState, GridCell } from './game'

export const allCells = (game: GameState) => {
	return game.map.grid.reduce((acc, c) => [...acc, ...c], [] as GridCell[])
}

export const adjacentCells = (game: GameState, x: number, y: number) => {
	const g = game.map.grid
	const w = game.map.width
	const h = game.map.height
	return [
		...(y > 0
			? [x > 0 && g[x - 1][y - 1], g[x][y - 1], x < w - 1 && g[x + 1][y - 1]]
			: []),
		x > 0 && g[x - 1][y],
		x < w - 1 && g[x + 1][y],
		...(y < h - 1
			? [x > 0 && g[x - 1][y + 1], g[x][y + 1], x < w - 1 && g[x + 1][y + 1]]
			: []),
	].filter((c) => c && c.enabled) as GridCell[]
}

export const ucFirst = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)
