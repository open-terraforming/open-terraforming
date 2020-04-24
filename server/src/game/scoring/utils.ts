import { shuffle } from '@shared/utils'

export const pickBest = <T>(values: T[], scoring: (v: T) => number) => {
	if (values.length === 0) {
		return undefined
	}

	return shuffle(values)
		.map(v => [scoring(v), v] as const)
		.sort(([a], [b]) => b - a)[0][1]
}
