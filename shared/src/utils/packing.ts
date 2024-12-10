const PACKING_DICTIONARY = ['id', 'playerId']

export const packObject = <T>(input: T) => {
	if (
		typeof input === 'string' ||
		typeof input === 'number' ||
		typeof input === 'boolean' ||
		input === null ||
		input === undefined
	) {
		return input
	}

	const output: Record<string, unknown> = {}

	if (Array.isArray(input)) {
		for (const [index, value] of input.entries()) {
			output[index] = packObject(value)
		}

		return output
	}

	for (const key in input) {
		const packedIndex = PACKING_DICTIONARY.indexOf(key)
		const packedValue = packObject(input[key])

		if (packedIndex >= 0) {
			output['$' + packedIndex] = packedValue
		} else {
			output[key] = packedValue
		}
	}

	return output
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unpackObject = <TOutput>(input: any): TOutput => {
	if (
		typeof input === 'string' ||
		typeof input === 'number' ||
		typeof input === 'boolean' ||
		input === null ||
		input === undefined
	) {
		return input as TOutput
	}

	if (Array.isArray(input)) {
		return input.map((value) => unpackObject(value)) as TOutput
	}

	const output: Record<string, unknown> = {}

	for (const key in input) {
		const unpackedKey = key.startsWith('$')
			? PACKING_DICTIONARY[+key.substring(1)]
			: key

		if (unpackedKey === undefined) {
			throw new Error('Dictionary key not found: ' + key)
		}

		output[unpackedKey] = unpackObject(input[key])
	}

	return output as TOutput
}
