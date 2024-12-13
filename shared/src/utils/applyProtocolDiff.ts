import { ProtocolDiff } from './getProtocolDiff'

export const applyProtocolDiff = <TSource>(
	target: TSource,
	diff: ProtocolDiff<TSource>,
) => {
	for (const key in diff) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const diffValue = diff[key] as null | { v: any } | { s: any }

		// NULL = the key was removed
		if (diffValue === null) {
			delete target[key as keyof TSource]
			continue
		}

		// Make sure the target has this key as object
		if (!target[key as keyof TSource]) {
			target[key as keyof TSource] = {} as TSource[keyof TSource]
		}

		// s - direct set
		if (
			typeof diffValue === 'object' &&
			diffValue !== null &&
			's' in diffValue
		) {
			target[key as keyof TSource] = diffValue.s
			continue
		}

		// v - the change is deeper
		if (typeof diffValue.v === 'object' && diffValue.v !== null) {
			// Make sure the target has this key as object
			if (!target[key as keyof TSource]) {
				target[key as keyof TSource] = {} as TSource[keyof TSource]
			}

			// Apply changes
			applyProtocolDiff(target[key as keyof TSource], diffValue.v)

			continue
		}

		// Apply scalar value
		target[key as keyof TSource] = diffValue.v
	}
}
