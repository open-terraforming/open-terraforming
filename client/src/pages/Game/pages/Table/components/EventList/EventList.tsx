import mars from '@/assets/mars-icon.png'
import { Button, DialogWrapper, Portal } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faExpand } from '@fortawesome/free-solid-svg-icons'
import { PlayerStateValue } from '@shared/index'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardsPlayedDisplay } from './components/CardsPlayedDisplay'
import { EventsModal } from './components/EventsModal'
import { EventSounds } from './components/EventSounds'
import { LastEventsDisplay } from './components/LastEventsDisplay'
import { PopEventDisplay } from './components/PopEventDisplay/PopEventDisplay'
import { TimeDisplay } from './components/TimeDisplay'
import { CheatsModal } from '../CheatsModal/CheatsModal'

type Props = {}

export const EventList = ({}: Props) => {
	const player = useAppStore(state => state.game.player)
	const events = useAppStore(state => state.game.events)
	const isAdmin = player.admin

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

	const handleFullscreen = () => {
		if (document.fullscreen) {
			document.exitFullscreen()
		} else {
			document.documentElement.requestFullscreen()
		}
	}

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
				<TopButtons>
					<Button onClick={handleFullscreen} icon={faExpand} />
					<EventLog onClick={() => setDisplayModal(true)}>Event log</EventLog>
					{isAdmin && (
						<DialogWrapper
							dialog={close => <CheatsModal open onClose={close} />}
						>
							{open => <Button onClick={open}>Cheats</Button>}
						</DialogWrapper>
					)}
					<TimeDisplay />
				</TopButtons>
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
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 2;
	max-height: 50%;
`

const TopButtons = styled.div`
	position: absolute;
	top: 0.2rem;
	left: 0.2rem;
	display: flex;
`

const EventLog = styled(Button)`
	margin-left: 0.2rem;
`
