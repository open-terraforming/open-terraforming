import {
	EventType,
	GameEvent,
} from '@shared/index'
import { useAppStore } from './hooks'
import { useEffect, useRef, useState } from 'react'

export const useGameEventHandler = <TEvent extends EventType>(
	type: TEvent,
	callback: (event: Extract<GameEvent, { type: TEvent }>) => void,
) => {
	const events = useAppStore((state) => state.game.events)
	const [processed, setProcessed] = useState(events.length)

	const callbackRef = useRef(callback)
	callbackRef.current = callback

	useEffect(() => {
		for (let i = processed; i < events.length; i++) {
			const event = events[i]

			if (event.type === type) {
				callbackRef.current(event as Extract<GameEvent, { type: TEvent }>)
			}
		}

		setProcessed(events.length)
	}, [events])
}
