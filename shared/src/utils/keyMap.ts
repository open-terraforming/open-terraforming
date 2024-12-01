export type KeysMatching<T, V> = {
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
	source = {} as Record<Extract<T[K], string | number | symbol>, T>,
): Record<Extract<T[K], string | number | symbol>, T> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as Extract<T[K], string | number | symbol>] = item

		return acc
	}, source)
}
