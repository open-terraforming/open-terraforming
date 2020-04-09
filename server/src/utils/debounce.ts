// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <A extends any[], R>(
	callback: (...args: A) => R,
	debounce = 100
): ((...args: A) => void) => {
	let timeout: ReturnType<typeof setTimeout>

	return (...args: A) => {
		if (timeout) {
			clearTimeout(timeout)
		}

		timeout = setTimeout(() => {
			clearTimeout(timeout)
			callback(...args)
		}, debounce)
	}
}
