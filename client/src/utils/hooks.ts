/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	useState,
	useEffect,
	EffectCallback,
	DependencyList,
	useRef,
	useCallback
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '@/store'
import { AppDispatch } from '@/store/utils'

export const useAppStore = <T>(selector: (state: StoreState) => T) => {
	return useSelector(selector)
}

export const useAppDispatch = useDispatch as () => AppDispatch

export const useDebounce = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value])

	return debouncedValue
}

export const useDebounceCallback = <T, A extends any[]>(
	value: (...args: A) => T,
	delay = 100
): ((...args: A) => void) => {
	const callback = useRef<(...args: A) => T>()
	const callArgs = useRef<A>()
	const timeout = useRef<ReturnType<typeof setTimeout>>()

	useEffect(
		() => () => (timeout.current ? clearTimeout(timeout.current) : undefined),
		[]
	)

	callback.current = value

	return useCallback(
		(...args: A) => {
			callArgs.current = args

			if (timeout.current) {
				clearTimeout(timeout.current)
			}

			timeout.current = setTimeout(() => {
				if (callback.current && callArgs.current) {
					callback.current.apply(null, callArgs.current)
				}
			}, delay)
		},
		[callback, callArgs, delay]
	)
}

export const useEffectWithoutMount = (
	effect: EffectCallback,
	deps?: DependencyList
) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		if (!mounted) {
			setMounted(true)

			return
		}

		return effect()
	}, deps)
}

/**
 * Attaches event callback to window when mounting and deattaches it when unmounting.
 * @param target
 * @param event
 * @param callback
 * @param cancelBubble
 */
export const useWindowEvent = <E extends Event>(
	event: string,
	callback: (e: E) => void,
	cancelBubble = false
) => useEvent(window, event, callback, cancelBubble)

/**
 * Attaches event callback to document when mounting  and deattaches it when unmounting.
 * @param target
 * @param event
 * @param callback
 * @param cancelBubble
 */
export const useDocumentEvent = <E extends Event>(
	event: string,
	callback: (e: E) => void,
	cancelBubble = false
) => useEvent(document, event, callback, cancelBubble)

/**
 * Attaches event callback to target when mounting and deattaches it when unmounting.
 * @param target
 * @param event
 * @param callback
 * @param cancelBubble
 */
export const useEvent = <E extends Event>(
	target: EventTarget,
	event: string,
	callback: (e: E) => void,
	cancelBubble = false
) => {
	// Hold reference to callback
	const callbackRef = useRef(callback)
	callbackRef.current = callback

	// Since we use ref, .current will always be correct callback
	const listener = useCallback(e => {
		if (callbackRef.current) {
			callbackRef.current(e as E)
		}
	}, [])

	useEffect(() => {
		// Add our listener on mount
		target.addEventListener(event, listener, cancelBubble)

		// Remove it on dismount
		return () => target.removeEventListener(event, listener)
	}, [])
}

/**
 * Returns previous props
 * @param value
 */
export const usePrevious = <T extends {}>(value: T) => {
	const ref = useRef<T>()

	useEffect(() => {
		ref.current = value
	}, [value])

	return ref.current
}

const hasAnyParentClass = (element: Element, classname?: string): boolean => {
	if (!classname) {
		return false
	}

	if (element.className?.split(' ').indexOf(classname) >= 0) {
		return true
	}

	return element.parentNode
		? hasAnyParentClass(element.parentNode as Element, classname)
		: false
}

/**
 * Call function when user clicks outside HTML element
 * @param ref useRef
 * @param onClickOutside call when user clicks outside ref
 * @param classNameToOmit if element or any of his parents have this className, do not call onClickOutside
 */
export const useClickOutside = (
	ref: React.RefObject<HTMLElement>,
	onClickOutside: () => void,
	classNameToOmit?: string
) => {
	const handleClickOutside = (event: MouseEvent) => {
		if (
			ref.current &&
			!ref.current.contains(event.target as Element) &&
			!hasAnyParentClass(event.target as Element, classNameToOmit)
		) {
			onClickOutside()
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	})
}

/**
 * setInterval cleared up before unmount
 * @param callback
 * @param delay
 */
export const useInterval = (callback: () => void, delay: number) => {
	const savedCallback = useRef<() => void>()

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		const tick = () => {
			if (savedCallback.current) {
				savedCallback.current()
			}
		}

		if (delay !== null) {
			const id = setInterval(tick, delay)

			return () => clearInterval(id)
		}
	}, [delay])
}

export const useAnimatedNumber = (value: number, delay = 100) => {
	const [lastValue, setLastValue] = useState(value)
	const lastTime = useRef<number>()
	const [display, setDisplay] = useState(value)

	const update = () => {
		const diff = lastTime.current
			? new Date().getTime() - lastTime.current
			: delay

		if (diff < delay) {
			setDisplay(Math.round(lastValue + ((value - lastValue) * diff) / delay))

			window.requestAnimationFrame(update)
		} else {
			setDisplay(value)
			setLastValue(value)
		}
	}

	useEffect(() => {
		lastTime.current = new Date().getTime()
		update()
	}, [value])

	return display
}
