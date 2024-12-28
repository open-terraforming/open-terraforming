export const partition = <T>(arr: T[], predicate: (item: T) => boolean) => {
	const truthy: T[] = []
	const falsy: T[] = []

	for (const item of arr) {
		if (predicate(item)) {
			truthy.push(item)
		} else {
			falsy.push(item)
		}
	}

	return [truthy, falsy] as const
}
