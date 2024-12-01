export const evaluateCompetition = <T, A extends { item: T; count: number }>(
	input: A[],
) => {
	const sorted = input.slice().sort((a, b) => b.count - a.count)

	// Find first and second items, join ties into one group
	const firstCount = sorted[0].count
	const first = sorted.filter((p) => p.count === firstCount)
	const secondCount = sorted.find((p) => p.count !== firstCount)?.count
	const second = sorted.filter((p) => p.count === secondCount)

	return {
		first,
		second,
		firstCount,
		secondCount,
	}
}
