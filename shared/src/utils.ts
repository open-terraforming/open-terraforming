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

type KeysMatching<T, V> = {
	[K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * Creates map from array using specified key.
 * @param collection array of items
 * @param key key to be used in the map
 */
export function keyMap<T, K extends KeysMatching<T, string | number>>(
	collection: T[],
	key: K,
	source = {} as Record<Extract<T[K], string | number | symbol>, T>
): Record<Extract<T[K], string | number | symbol>, T> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as Extract<T[K], string | number | symbol>] = item

		return acc
	}, source)
}
