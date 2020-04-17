import React, { useState, useEffect, useCallback } from 'react'
import { PopEvent, EventType, GameEvent } from '../../types'
import { PlayingChanged } from './components/PlayingChanged'
import { GenerationChanged } from './components/GenerationChanged'
import { filterEvents } from '../../utils'
import { ProductionPhase } from './components/ProductionPhase'

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
			setPopEvents(e =>
				[
					...e,
					...(filterEvents(
						events.map((e, i) => ({ ...e, id: i })).slice(processed),
						[
							EventType.NewGeneration,
							EventType.PlayingChanged,
							EventType.ProductionPhase
						]
					) as PopEvent[])
				]
					.reverse()
					.slice(0, 3)
					.reverse()
			)

			setProcessed(events.length)
		}
	}, [events])

	const event = popEvents[0]

	if (event) {
		switch (event.type) {
			case EventType.PlayingChanged: {
				return (
					<PlayingChanged
						key={event.id}
						playing={event.playing}
						onDone={handleDone}
					/>
				)
			}

			case EventType.NewGeneration: {
				return <GenerationChanged key={event.id} onDone={handleDone} />
			}

			case EventType.ProductionPhase: {
				return <ProductionPhase key={event.id} onDone={handleDone} />
			}
		}
	} else {
		return <></>
	}
}
