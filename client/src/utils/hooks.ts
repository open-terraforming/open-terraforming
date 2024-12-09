/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameEvent } from '@shared/index'
import { StoreState } from '@/store'
import { AppDispatch } from '@/store/utils'
import {
	DependencyList,
	EffectCallback,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useAppStore = <T>(selector: (state: StoreState) => T) => {
	return useSelector(selector)
}

export const useAppDispatch = useDispatch as () => AppDispatch

export const usePlayerState = () => useAppStore((state) => state.game.player)
export const useGameState = () => useAppStore((state) => state.game.state)

export const usePlayersMap = () => useAppStore((state) => state.game.playerMap)

export const useWindowEvent = <EType extends keyof WindowEventMap>(
	event: EType,
	callback: (e: WindowEventMap[EType]) => void,
	cancelBubble = false,
) => useEvent(window, event, callback, cancelBubble)

export const useDocumentEvent = <EType extends keyof DocumentEventMap>(
	event: EType,
	callback: (e: DocumentEventMap[EType]) => void,
	cancelBubble = false,
) => useEvent(document, event, callback, cancelBubble)

export const useElementEvent = <EType extends keyof HTMLElementEventMap>(
	element: HTMLElement | null,
	event: EType,
	callback: (e: HTMLElementEventMap[EType]) => void,
	cancelBubble = false,
) => useEvent(element, event, callback, cancelBubble)

export const useEvent = <E extends Event>(
	target: EventTarget | null,
	event: string,
	callback: (e: E) => void,
	cancelBubble = false,
) => {
	// Hold reference to callback
	const callbackRef = useRef(callback)
	callbackRef.current = callback

	useEffect(() => {
		if (target) {
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
		}
	}, [target])
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

export const useAnimatedNumber = (
	value: number,
	delay = 100,
	initialValue?: number,
) => {
	// Stop animating when component unmounts
	const mounted = useRef(true)

	// This is the only change that should cause render
	const [display, setDisplay] = useState(initialValue ?? value)

	// Internal data, no need to rerender when those change
	const state = useRef<{
		targetValue: number
		startValue: number
		startTime: number
		animationFrame?: number
	}>({
		targetValue: value,
		startTime: 0,
		startValue: value,
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

export const useElementPosition = (
	element?: Element | null,
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
	callback: (events: (GameEvent & { id: number })[], processed: number) => void,
) => {
	const events = useAppStore((state) => state.game.events)
	const [processed, setProcessed] = useState(events.length)

	useEffect(() => {
		if (events.length > processed) {
			callback(
				events.slice(processed).map((e, i) => ({ ...e, id: processed + i })),
				processed,
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

export const useChange = (effect: EffectCallback, deps?: DependencyList) => {
	const mounted = useRef(false)

	useEffect(() => {
		if (mounted.current) {
			effect()
		} else {
			mounted.current = true
		}
	}, deps)
}

export const useToggle = (initial = false) => {
	const [state, setState] = useState(initial)

	const toggle = useCallback(() => setState((s) => !s), [])

	return [state, toggle, setState] as const
}
