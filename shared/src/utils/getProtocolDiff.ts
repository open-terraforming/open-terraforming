/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProtocolDiffValue<Type> = { v: ProtocolDiff<Type> } | { s: Type }

export type ProtocolDelete = null

export type ProtocolDiff<TSource> = TSource extends
	| string
	| number
	| boolean
	| symbol
	| null
	? TSource
	: TSource extends Array<infer T>
		? {
				[K in number | 'length']?: ProtocolDiffValue<T> | ProtocolDelete
			}
		: TSource extends object
			? {
					[K in keyof TSource]?: ProtocolDiffValue<TSource[K]> | ProtocolDelete
				}
			: TSource

const valueDiff = <TValue>(
	aValue: TValue,
	bValue: TValue,
): [boolean, ({ v: ProtocolDiff<TValue> } | { s: TValue })?] => {
	// Type mismatch = always different
	if (
		typeof aValue !== typeof bValue ||
		(Array.isArray(aValue) && !Array.isArray(bValue)) ||
		(!Array.isArray(aValue) && Array.isArray(bValue))
	) {
		return [true, { s: bValue }]
	}

	// Both nil the same way - no difference
	if (
		(aValue === undefined && bValue === undefined) ||
		(aValue === null && bValue === null)
	) {
		return [false]
	}

	// Scalars should be compared directly
	if (typeof aValue !== 'object' && aValue !== bValue) {
		return [true, { s: bValue }]
	}

	// One is null, but the other one isn't
	if ((aValue === null || bValue === null) && aValue !== bValue) {
		return [true, { s: bValue }]
	}

	// Compare two arrays
	if (Array.isArray(aValue)) {
		const diff = {} as Record<string | number, unknown>

		if (!Array.isArray(bValue)) {
			throw new Error('Array mismatch')
		}

		for (let i = 0; i < Math.max(aValue.length, bValue.length); i++) {
			const [hasDiff, diffValue] = valueDiff(aValue[i], bValue[i])

			if (hasDiff) {
				if (
					diffValue === undefined ||
					('s' in diffValue && diffValue.s === undefined)
				) {
					diff[i] = null
				} else {
					diff[i] = diffValue
				}
			}
		}

		if (aValue.length !== bValue.length) {
			diff.length = { v: bValue.length }
		}

		if (Object.keys(diff).length > 0) {
			return [true, { v: diff as ProtocolDiff<TValue> }]
		}
	}

	// Compare two objects
	const changes = getProtocolDiff(
		aValue as Record<string | number | symbol, any>,
		bValue as Record<string | number | symbol, any>,
	)

	if (Object.keys(changes).length > 0) {
		return [true, { v: changes as ProtocolDiff<TValue> }]
	}

	return [false]
}

/**
 * Result is in format:
 *  [key]: null         - key was removed
 *  [key]: { v: value } - there's a deeper change
 *  [key]: { s: value } - the key has a new value
 */
export const getProtocolDiff = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TSource extends Record<string | number | symbol, any>,
>(
	a: TSource,
	b: TSource,
) => {
	const result = {} as Record<string | number | symbol, unknown>
	const bKeys = Object.keys(b)

	Object.keys(a)
		.filter((k) => !bKeys.includes(k))
		.forEach((key) => {
			result[key] = null
		})

	bKeys.forEach((key) => {
		const aValue = a[key]
		const bValue = b[key]

		const [isDifferent, diffValue] = valueDiff(aValue, bValue)

		if (isDifferent) {
			result[key] = diffValue
		}
	})

	return result as ProtocolDiff<TSource>
}
