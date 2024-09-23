import { useState } from 'react'
import { EventLine } from './EventLine'
import { useInterval } from '@/utils/hooks'
import { GameEvent } from '@shared/index'

type Props = {
	events: GameEvent[]
}

type DisplayedEvent = {
	id: number
	event: GameEvent
}

export const LastEventsDisplay = ({ events }: Props) => {
	const [displayedEvents, setDisplayedEvents] = useState([] as DisplayedEvent[])
	const [lastDisplayed, setLastDisplayed] = useState(events.length)

	useInterval(() => {
		if (lastDisplayed < events.length) {
			setDisplayedEvents((e) => [
				{ id: lastDisplayed, event: events[lastDisplayed] },
				...e,
			])

			setLastDisplayed((e) => e + 1)
		}
	}, 250)

	const handleDone = () => {
		setDisplayedEvents((d) => d.slice(0, d.length - 1))
	}

	return (
		<>
			{displayedEvents.map((e) => (
				<EventLine
					event={e.event}
					key={e.id}
					animated={true}
					onDone={handleDone}
				/>
			))}
		</>
	)
}
