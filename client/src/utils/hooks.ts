/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameEvent } from '@/pages/Game/pages/Table/components/EventList/types'
import { StoreState } from '@/store'
import { AppDispatch } from '@/store/utils'
import {
	DependencyList,
	EffectCallback,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useAppStore = <T>(selector: (state: StoreState) => T) => {
	return useSelector(selector)
}

export const useAppDispatch = useDispatch as () => AppDispatch

export const usePlayerState = () => useAppStore(state => state.game.player)
export const useGameState = () => useAppStore(state => state.game.state)

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

	useEffect(() => {
		// Since we use ref, .current will always be correct callback
		const listener = (e: any) => {
			if (callbackRef.current) {
				callbackRef.current(e as E)
			}
		}

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
	// Stop animating when component unmounts
	const mounted = useRef(true)

	// This is the only change that should cause render
	const [display, setDisplay] = useState(value)

	// Internal data, no need to rerender when those change
	const state = useRef<{
		targetValue: number
		startValue: number
		startTime: number
		animationFrame?: number
	}>({
		targetValue: value,
		startTime: 0,
		startValue: value
	})

	// Keeps requesting frames and updating value until we reach the target delay
	const update = useCallback(() => {
		if (!mounted.current) {
			return
		}

		const { startTime, startValue, targetValue } = state.current

		const time = (startTime ? new Date().getTime() - startTime : delay) / delay

		if (time < 1) {
			setDisplay(Math.round(startValue + (targetValue - startValue) * time))

			state.current.animationFrame = window.requestAnimationFrame(update)
		} else {
			setDisplay(targetValue)
			state.current.animationFrame = undefined
		}
	}, [])

	// Tracks if component is mounted
	useEffect(() => {
		mounted.current = true

		return () => {
			mounted.current = false
		}
	}, [])

	// Updates counter when target value changes
	useEffect(() => {
		state.current.startTime = new Date().getTime()
		state.current.startValue = display
		state.current.targetValue = value

		if (state.current.animationFrame === undefined) {
			update()
		}
	}, [value])

	return display
}

/**
 * setInterval cleared up before unmount
 * @param callback
 * @param delay
 */
export const useAnimationFrame = (callback: () => void) => {
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

			window.requestAnimationFrame(tick)
		}

		tick()
	}, [])
}

interface Position {
	left: number
	top: number
	width: number
	height: number
}

function getPosition(el: HTMLElement, global = true): Position {
	if (!el) {
		return {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		}
	}

	const bb = el.getBoundingClientRect()
	let offsetLeft = el.offsetLeft
	let offsetTop = el.offsetTop
	let current: HTMLElement | null = el.offsetParent as HTMLElement

	while (current) {
		offsetLeft += current.offsetLeft
		offsetTop += current.offsetTop
		current = current.offsetParent as HTMLElement

		if (!global && current) {
			const position = getComputedStyle(current).getPropertyValue('position')

			if (position === 'relative' || position === 'absolute') {
				break
			}
		}
	}

	return {
		left: offsetLeft,
		top: offsetTop,
		width: bb.width,
		height: bb.height
	}
}

export const useElementPosition = (
	element?: Element | null
): DOMRect | undefined => {
	const elementRef = useRef<Element | null>()
	const bb = element ? element.getBoundingClientRect() : undefined

	const [position, setPosition] = useState(bb)

	elementRef.current = element

	useEffect(() => {
		if (element) {
			setPosition(element.getBoundingClientRect())
		}
	}, [element])

	useEffect(() => {
		const update = () => {
			if (elementRef.current) {
				setPosition(elementRef.current.getBoundingClientRect())
			}
		}

		window.addEventListener('resize', update)
		window.addEventListener('scroll', update, true)

		return () => {
			window.removeEventListener('resize', update)
			window.removeEventListener('scroll', update, true)
		}
	}, [])

	return position
}

export const useProcessed = (
	callback: (events: (GameEvent & { id: number })[], processed: number) => void
) => {
	const [processed, setProcessed] = useState(0)
	const events = useAppStore(state => state.game.events)

	useEffect(() => {
		if (events.length > processed) {
			callback(
				events.slice(processed).map((e, i) => ({ ...e, id: processed + i })),
				processed
			)

			setProcessed(events.length)
		}
	}, [events])
}

export const useMounted = () => {
	const mounted = useRef(true)

	useEffect(() => {
		return () => {
			mounted.current = false
		}
	}, [])

	return mounted
}

export const useMountAnim = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setTimeout(() => setMounted(true))
	}, [])

	return mounted
}
