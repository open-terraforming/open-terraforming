import React, { useState, useEffect, useCallback } from 'react'
import { PopEvent, EventType, GameEvent } from '../types'
import { PlayingChanged } from './PlayingChanged'
import { GenerationChanged } from './GenerationChanged'
import { filterEvents } from '../utils'

type Props = {
	events: GameEvent[]
}

export const PopEventDisplay = ({ events }: Props) => {
	const [processed, setProcessed] = useState(0)
	const [popEvents, setPopEvents] = useState([] as PopEvent[])

	const handleDone = useCallback(() => {
		setPopEvents(d => d.slice(1))
	}, [])

	useEffect(() => {
		if (events.length > processed) {
			setPopEvents(e => [
				...e,
				...(filterEvents(events.slice(processed), [
					EventType.NewGeneration,
					EventType.PlayingChanged
				]) as PopEvent[])
			])

			setProcessed(events.length)
		}
	}, [events])

	const event = popEvents[0]

	if (event) {
		switch (event.type) {
			case EventType.PlayingChanged: {
				return (
					<PlayingChanged
						key={event.playing}
						playing={event.playing}
						onDone={handleDone}
					/>
				)
			}

			case EventType.NewGeneration: {
				return <GenerationChanged onDone={handleDone} />
			}
		}
	} else {
		return <></>
	}
}
