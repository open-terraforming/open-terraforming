import { GameEvent } from '@/pages/Game/pages/Table/components/EventList/types'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from './hooks'

export const useGameEventsHandler = (callback: (event: GameEvent) => void) => {
	const events = useAppStore((state) => state.game.events)
	const [processed, setProcessed] = useState(events.length)

	const callbackRef = useRef(callback)
	callbackRef.current = callback

	useEffect(() => {
		for (let i = processed; i < events.length; i++) {
			const event = events[i]

			callbackRef.current(event as GameEvent)
		}

		setProcessed(events.length)
	}, [events])
}
