import mars from '@/assets/mars-icon.png'
import { Button } from '@/components'
import { useAppStore, useInterval } from '@/utils/hooks'
import { PlayerStateValue } from '@shared/index'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardsPlayedDisplay } from './components/CardsPlayedDisplay'
import { EventLine } from './components/EventLine'
import { EventsModal } from './components/EventsModal'
import { PopEventDisplay } from './components/PopEventDisplay'
import { GameEvent } from './types'
import { getEvents } from './utils'

type Props = {}

type DisplayedEvent = {
	id: number
	event: GameEvent
}

export const EventList = ({}: Props) => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)

	const [events, setEvents] = useState([] as GameEvent[])
	const [lastDisplayed, setLastDisplayed] = useState(0 as number)
	const [displayedEvents, setDisplayedEvents] = useState([] as DisplayedEvent[])
	const [lastGame, setLastGame] = useState(game)
	const [displayModal, setDisplayModal] = useState(false)

	useInterval(() => {
		if (lastDisplayed < events.length) {
			setDisplayedEvents(e => [
				{ id: lastDisplayed, event: events[lastDisplayed] },
				...e
			])

			setLastDisplayed(e => e + 1)
		}
	}, 250)

	const handleDone = () => {
		setDisplayedEvents(d => d.slice(0, d.length - 1))
	}

	useEffect(() => {
		if (game && lastGame) {
			const newEvents = getEvents(lastGame, game)

			if (newEvents.length > 0) {
				setEvents([...events, ...newEvents])
			}
		}

		setLastGame(game)
	}, [game])

	useEffect(() => {
		if (
			document.hidden &&
			(player?.state === PlayerStateValue.Playing ||
				player?.state === PlayerStateValue.PickingCards)
		) {
			if (Notification.permission === 'granted') {
				const notification = new Notification("It's your turn!", {
					icon: mars
				})

				notification.onclick = () => {
					window.focus()
					parent.focus()
					notification.close()
				}
			}
		}
	}, [player?.state])

	return (
		<Centered>
			{displayModal && (
				<EventsModal events={events} onClose={() => setDisplayModal(false)} />
			)}
			{displayedEvents.map(e => (
				<EventLine
					event={e.event}
					key={e.id}
					animated={true}
					onDone={handleDone}
				/>
			))}
			<CardsPlayedDisplay events={events} />
			<PopEventDisplay events={events} />
			<Button onClick={() => setDisplayModal(true)}>Event log</Button>
		</Centered>
	)
}

const Centered = styled.div`
	width: 100%;
	margin-top: 1rem;
	flex: 1;
	min-height: 0;
	overflow: visible;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	max-width: 13rem;
	width: 13rem;
	min-width: 0;
`
