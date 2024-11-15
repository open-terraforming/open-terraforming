
export const voidReduceRight = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => any
) => {
	return array.reduceRight((acc, item, index) => {
		callback(acc, item, index);

		return acc;
	}, accumulator);
};
