import mars from '@/assets/mars-icon.png'
import { Button, Portal } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { PlayerStateValue } from '@shared/index'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardsPlayedDisplay } from './components/CardsPlayedDisplay'
import { EventsModal } from './components/EventsModal'
import { EventSounds } from './components/EventSounds'
import { LastEventsDisplay } from './components/LastEventsDisplay'
import { PopEventDisplay } from './components/PopEventDisplay/PopEventDisplay'

type Props = {}

export const EventList = ({}: Props) => {
	const player = useAppStore(state => state.game.player)
	const events = useAppStore(state => state.game.events)

	const [displayModal, setDisplayModal] = useState(false)

	useEffect(() => {
		if (
			document.hidden &&
			(player?.state === PlayerStateValue.Playing ||
				player?.state === PlayerStateValue.Picking)
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
			<EventSounds events={events} />
			<CardsPlayedDisplay events={events} />
			<LastEventsDisplay events={events} />
			<PopEventDisplay events={events} />
			<Portal>
				<EventLog onClick={() => setDisplayModal(true)}>Event log</EventLog>
			</Portal>
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
	position: relative;
`

const EventLog = styled(Button)`
	position: absolute;
	top: 0;
	left: 0;
`
