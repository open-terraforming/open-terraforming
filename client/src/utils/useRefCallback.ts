import { useCallback, useRef } from 'react'

export const useRefCallback = <TArguments extends unknown[], TResult>(
	cb: (...args: TArguments) => TResult,
) => {
	const cbRef = useRef(cb)
	cbRef.current = cb

	const callback = useCallback((...args: TArguments) => {
		cbRef.current.apply(this, args)
	}, [])

	return callback
}
