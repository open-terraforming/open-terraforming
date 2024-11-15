import { GameState, GridCell } from "..";


export const adjacentCells = (game: GameState, x: number, y: number) => {
	const g = game.map.grid;
	const w = game.map.width;
	const h = game.map.height;

	return [
		...(y > 0
			? [
				y % 2 === 0 && x > 0 && g[x - 1][y - 1],
				g[x][y - 1],
				y % 2 === 1 && x < w - 1 && g[x + 1][y - 1],
			]
			: []),
		x > 0 && g[x - 1][y],
		x < w - 1 && g[x + 1][y],
		...(y < h - 1
			? [
				y % 2 === 0 && x > 0 && g[x - 1][y + 1],
				g[x][y + 1],
				y % 2 === 1 && x < w - 1 && g[x + 1][y + 1],
			]
			: []),
	].filter((c) => c && c.enabled) as GridCell[];
};
