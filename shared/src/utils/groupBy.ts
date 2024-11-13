export const groupBy = <T, K>(array: T[], key: (item: T) => K): Map<K, T[]> =>
	array.reduce((acc, item) => {
		const value = key(item)
		const array = acc.get(value) ?? []
		array.push(item)
		acc.set(value, array)

		return acc
	}, new Map<K, T[]>())
