/* eslint-disable @typescript-eslint/no-explicit-any */
export type ProtocolDiffValue<Type> = { v: Type } | { s: Type }

export type ProtocolDelete = null

export type ProtocolDiff<TSource> = TSource extends object
	? { [K in keyof TSource]?: ProtocolDiffItem<TSource[K]> }
	: TSource

export type ProtocolDiffItem<TSource> = TSource extends
	| string
	| number
	| boolean
	| symbol
	| null
	? ProtocolDiffValue<TSource> | ProtocolDelete
	: TSource extends Array<infer T>
		? ProtocolDiffValue<{
				[K in number | 'length']?: ProtocolDiffValue<T> | ProtocolDelete
			}>
		: TSource extends object
			? ProtocolDiffValue<{
					[K in keyof TSource]?: ProtocolDiffItem<TSource[K]>
				}>
			: TSource

const valueDiff = (
	aValue: any,
	bValue: any,
): [boolean, ({ v: any } | { s: any })?] => {
	if (
		typeof aValue !== typeof bValue ||
		(Array.isArray(aValue) && !Array.isArray(bValue)) ||
		(!Array.isArray(aValue) && Array.isArray(bValue))
	) {
		return [true, { s: bValue }]
	} else {
		if (typeof aValue === 'undefined') {
			return [false]
		}

		if (typeof aValue !== 'object' || aValue === null || bValue === null) {
			if (aValue !== bValue) {
				return [true, { s: bValue }]
			}
		} else {
			if (!Array.isArray(aValue)) {
				const changes = getProtocolDiff(aValue, bValue)

				if (Object.keys(changes).length > 0) {
					return [true, { v: changes }]
				}
			} else {
				const diff = {} as Record<string, unknown>

				for (let i = 0; i < Math.max(aValue.length, bValue.length); i++) {
					const [hasDiff, diffValue] = valueDiff(aValue[i], bValue[i])

					if (hasDiff) {
						if (diffValue === undefined) {
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
					return [true, { v: diff }]
				}
			}
		}
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
