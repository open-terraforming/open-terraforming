export const sortBy = <T>(a: T[], score: (a: T) => number) => {
	return a
		.map((i) => [score(i), i] as const)
		.sort(([a], [b]) => a - b)
		.map(([, i]) => i)
}
