export const nextFrame = () => new Promise((resolve) => setTimeout(resolve))

export const wait = (timeoutInMs: number) =>
	new Promise((resolve) => setTimeout(resolve, timeoutInMs))

export const asyncDebounce = <
	F extends (...args: A) => Promise<T>,
	A extends Array<unknown>,
	T
>(
	debounced: F,
	delay = 200
) => {
	let timeout = undefined as ReturnType<typeof setTimeout> | undefined
	let previousResolve = undefined as (() => void) | undefined

	return (...args: A): Promise<T> =>
		new Promise((resolve) => {
			if (timeout !== undefined) {
				clearTimeout(timeout)
				timeout = undefined
			}

			if (previousResolve !== undefined) {
				previousResolve()
				previousResolve = undefined
			}

			previousResolve = resolve

			timeout = setTimeout(async () => {
				timeout = undefined
				previousResolve = undefined

				resolve(debounced(...args))
			}, delay)
		})
}
