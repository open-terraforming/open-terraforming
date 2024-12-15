export const stripUndefined = <TInput>(input: TInput): TInput => {
	if (typeof input !== 'object' || input === null) {
		return input
	}

	if (Array.isArray(input)) {
		return input.map(stripUndefined) as unknown as TInput
	}

	const result = {} as TInput

	for (const key in input) {
		if (input[key] !== undefined) {
			result[key] = stripUndefined(input[key])
		}
	}

	return result
}
