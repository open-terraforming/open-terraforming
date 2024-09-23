import { useProcessed } from '@/utils/hooks'
import { useState } from 'react'
import { EventType } from '@shared/index'
import { filterEvents } from '../../EventList/utils'
import { HeaderEvent, HeaderEventText } from './HeaderEventText'

export const HeaderEventDisplay = () => {
	const [events, setEvents] = useState([] as HeaderEvent[])

	useProcessed((events) =>
		setEvents((e) => [
			...e,
			...(filterEvents(events, [
				EventType.MilestoneBought,
				EventType.CompetitionSponsored,
			]) as HeaderEvent[]),
		]),
	)

	const handleDone = () => {
		setEvents((e) => e.slice(1))
	}

	const ev = events[0]

	return !ev ? null : (
		<HeaderEventText key={ev.id} ev={ev} onDone={handleDone} />
	)
}
