export const voidReduceRight = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => unknown,
) => {
	return array.reduceRight((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}
