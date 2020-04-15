/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle<T>(a: T[]) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

export interface NativeMap<T> {
	[key: string]: T | undefined
}

/**
 * Creates map from array using specified key.
 * @param collection array of items
 * @param key key to be used in the map
 */
export function keyMap<T, K extends keyof T>(
	collection: T[],
	key: K,
	source = {} as NativeMap<T>
): NativeMap<T> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as any] = item

		return acc
	}, source)
}

/**
 * Creates map from array using specified key and specified value key.
 * @param collection array of items
 * @param key key to be used in the map
 * @param valueKey key extracted from item
 */
export function keyValueMap<T, K1 extends keyof T, K2 extends keyof T>(
	collection: T[],
	key: K1,
	valueKey: K2,
	source = {} as NativeMap<T[K2]>
): NativeMap<T[K2]> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as any] = item[valueKey]

		return acc
	}, source)
}

/**
 * Merges multiple arrays into one array containing only unique items.
 * @param arrays arrays to merge
 */
export function uniqueMerge<T>(...arrays: T[][]) {
	const items: NativeMap<T> = {}

	arrays.forEach(array => {
		array.forEach(item => {
			items[JSON.stringify(item)] = item
		})
	})

	return Object.keys(items).map(key => items[key])
}

export const ucFirst = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

/**
 * Generates array containing numbers between start and end (excluding).
 * @param start beginning number
 * @param end ending number (excluding)
 * @param step range step, defaults to 1
 */
export function range(start: number, end: number, step = 1) {
	const result = [] as number[]

	for (let i = start; i < end; i += step) {
		result.push(i)
	}

	return result
}

/**
 * Finds first match in specified array.
 * @param items list of items
 * @param key key used for matching
 * @param value value to be matched agains key
 * @param notFound value returned when there is no match
 */
export function firstKeyMatch<T, K extends keyof T>(
	items: T[],
	key: K,
	value: T[K],
	notFound?: T
): T | undefined {
	if (!items) {
		return notFound
	}

	for (const item of items) {
		if (item[key] === value) {
			return item
		}
	}

	return notFound
}

/**
 * Splits props into two.
 * @param original all props merged into one object
 * @param splitKeys keys to be removed from the original and returned as new props
 * @TODO: Wrong return type, we have to somehow bend Pick to return object only with specified keys
 */
export function splitProps<T, K extends (keyof T)[]>(
	original: T,
	splitKeys: K
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
	return splitKeys.reduce((props, key) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props[key] = original[key] as any
		delete original[key]

		return props
	}, {} as T)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shallowEqual(a: any, b: any) {
	if (a === b) {
		return true
	}

	if ((!a && b) || (!b && a)) {
		return false
	}

	const aKeys = Object.keys(a)
	const bKeys = Object.keys(b)

	if (aKeys.length !== bKeys.length) {
		return false
	}

	// tslint:disable-next-line: prefer-for-of
	for (let i = 0; i < aKeys.length; i++) {
		if (!b.hasOwnProperty(aKeys[i]) || a[aKeys[i]] !== b[aKeys[i]]) {
			return false
		}
	}

	return true
}

export function compareFlatArrays<T>(
	a: T[] | null | undefined,
	b: T[] | null | undefined
) {
	if (a === b) {
		return true
	}

	if (!a || !b) {
		return false
	}

	if (a.length !== b.length) {
		return false
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false
		}
	}

	return true
}

export const detectChanges = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	a: { [key: string]: any },
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	b: { [key: string]: any }
) => {
	const messages = [] as string[]

	/*
	if (!compareFlatArrays(Object.keys(a), Object.keys(b))) {
		let leftOut = Object.keys(b)
		Object.keys(a).forEach(key => {
			if (leftOut.includes(key)) {
				leftOut = leftOut.filter(k => k !== key)
			} else {
				messages.push(`Key ${key} is not in the object B`)
			}
		})

		leftOut.forEach(key => {
			messages.push(`Key ${key} is not in the object A`)
		})
	}
	*/

	Object.entries(a).forEach(([key, value]) => {
		const bValue = b[key]

		if (bValue !== value) {
			messages.push(`${key}: ${value} !== ${bValue}`)
			//messages.push(JSON.stringify(value))
			//messages.push(JSON.stringify(bValue))
		}
	})

	return messages
}

/**
 * Creates value, label collection from enum
 * @param enum enumeration
 */
export function enumToValueLabelCollection(enumeration: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}): { value: string; label: string }[] {
	return Object.keys(enumeration).map(entry => ({
		value: entry,
		label: enumeration[entry]
	}))
}

/**
 * Provides type-safe way of filtering out nulls
 * @param it
 */
export function isNotNull<T>(it: T): it is NonNullable<T> {
	return it != null
}

/**
 * Provides type-safe way of filtering out undefined
 * @param it
 */
export function isNotUndefined<T>(it: T): it is NonNullable<T> {
	return it != undefined
}

/**
 * Extends specified object with specified object, the extension is deep,
 * which means you can update only part of object in extended object.
 *
 * The extension is inplace.
 *
 * Note about extending arrays:
 *  - when source value is array and target value is also array, it's replaced with target value and that's it
 *  - when source value is array and target is object, it's expected that object only has numeric properties and only
 *      values that correspond to the index (which is numeric prop of target object) are extended with object values
 *
 * @param source object to be extended
 * @param extending extending object
 * @returns the source (same reference that was in the source param)
 */
export const deepExtend = (source: any, extending: any) => {
	Object.entries(extending).forEach(([key, value]: [string | number, any]) => {
		let sourceValue = (source as any)[key]

		if (typeof value === 'object') {
			if (value === null) {
				;(source as any)[key] = null
			} else {
				if (sourceValue === undefined) {
					;(source as any)[key] = sourceValue = Array.isArray(value) ? [] : {}
				} else {
					/*
					// eslint-disable-next-line padding-line-between-statements
					;(source as any)[key] = sourceValue = Array.isArray(sourceValue)
						? [...sourceValue]
						: { ...sourceValue }
					*/
				}

				if (Array.isArray(value)) {
					;(source as any)[key] = [...value]
				} else {
					deepExtend(sourceValue, value)
				}
			}
		} else {
			;(source as any)[key] = value
		}
	})

	return source
}

export const deepCopy = <T>(s: T): T => {
	if (typeof s === 'object') {
		if (s === null) {
			return s
		}

		if (Array.isArray(s)) {
			return (s.map(i => deepCopy(i)) as unknown) as T
		}

		const res = {} as any
		Object.entries(s).forEach(([key, value]) => {
			res[key] = deepCopy(value)
		})

		return res
	} else {
		return s
	}
}
