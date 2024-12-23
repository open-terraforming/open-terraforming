export const voidReduce = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => unknown,
) => {
	return array.reduce((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}
