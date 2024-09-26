import mars from '@/assets/mars-icon.png'
import { Button, DialogWrapper, Portal } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faBars, faExpand } from '@fortawesome/free-solid-svg-icons'
import { PlayerStateValue } from '@shared/index'
import { useEffect } from 'react'
import styled from 'styled-components'
import { CheatsModal } from '../CheatsModal/CheatsModal'
import { InYourFaceEvents } from '../InYourFaceEvents/InYourFaceEvents'
import { EventsModal } from './components/EventsModal'
import { EventSounds } from './components/EventSounds'
import { IngameMenuModal } from './components/IngameMenuModal'
import { LastEventsDisplay } from './components/LastEventsDisplay'
import { PopEventDisplay } from './components/PopEventDisplay/PopEventDisplay'
import { TimeDisplay } from './components/TimeDisplay'
import { Flex } from '@/components/Flex/Flex'

export const EventList = () => {
	const player = useAppStore((state) => state.game.player)
	const events = useAppStore((state) => state.game.events)
	const settings = useAppStore((state) => state.settings.data)
	const isAdmin = player.admin

	useEffect(() => {
		if (
			settings.enableBrowserNotifications &&
			document.hidden &&
			(player?.state === PlayerStateValue.Playing ||
				player?.state === PlayerStateValue.Picking)
		) {
			if (Notification.permission === 'granted') {
				const notification = new Notification("It's your turn!", {
					icon: mars,
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
			<EventSounds events={events} />
			<LastEventsDisplay events={events} />
			<PopEventDisplay events={events} />
			<Portal>
				<TopButtons>
					<Flex gap={'0.2rem'}>
						<DialogWrapper
							dialog={(close) => <IngameMenuModal onClose={close} />}
						>
							{(open) => <Button noClip onClick={open} icon={faBars}></Button>}
						</DialogWrapper>
						<Button noClip onClick={handleFullscreen} icon={faExpand} />
						<DialogWrapper
							dialog={(close) => (
								<EventsModal events={events} onClose={close} />
							)}
						>
							{(open) => (
								<Button noClip onClick={open}>
									Event log
								</Button>
							)}
						</DialogWrapper>
						{isAdmin && (
							<DialogWrapper
								dialog={(close) => <CheatsModal open onClose={close} />}
							>
								{(open) => (
									<Button noClip onClick={open}>
										Cheats
									</Button>
								)}
							</DialogWrapper>
						)}
						<TimeDisplay />
					</Flex>

					<InYourFaceEvents />
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
`
