import { useState, useMemo } from 'react'

export const useDebouncedValue = <TValue>(value: TValue, timeout: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useMemo(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
		}, timeout)

		return () => {
			clearTimeout(timer)
		}
	}, [value, timeout])

	return debouncedValue
}
