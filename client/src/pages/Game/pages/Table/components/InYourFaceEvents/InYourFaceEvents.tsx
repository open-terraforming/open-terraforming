import { Button, Portal } from '@/components'
import { ClippedBox } from '@/components/ClippedBox'
import { Flex } from '@/components/Flex/Flex'
import { useAppStore, useToggle } from '@/utils/hooks'
import { useGameEventsHandler } from '@/utils/useGameEventsHandler'
import { faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GameEvent } from '@shared/index'
import { useCallback, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { InYourFaceEvent } from './components/InYourFaceEvent'
import { InYourFaceEventsList } from './components/InYourFaceEventsList'
import { InYourFaceEventTitle } from './components/InYourFaceEventTitle'
import { isInYourFaceEvent } from './utils/isInYourFaceEvent'

export const InYourFaceEvents = () => {
	const player = useAppStore((state) => state.game.player)

	const highlighted = useAppStore(
		(state) => state.game.highlightedCells.length > 0,
	)

	const [shown, toggleShown, setShown] = useToggle()
	const [rendered, setRendered] = useState(false)
	const [events, setEvents] = useState<GameEvent[]>([])
	const [showList, toggleList] = useToggle()

	const current = events[0]

	useGameEventsHandler((event) => {
		if ('playerId' in event && event.playerId === player.id) {
			return
		}

		if (isInYourFaceEvent({ event })) {
			setEvents((events) => [...events, event])
		}
	})

	useEffect(() => {
		if (!shown) {
			const timeout = setTimeout(() => setRendered(false), 200)

			return () => clearTimeout(timeout)
		} else {
			setRendered(true)
		}
	}, [shown])

	const handleDismiss = useCallback(() => {
		setEvents((events) => events.slice(1))
	}, [])

	const handleShow = () => {
		if (current) {
			toggleShown()
		} else {
			toggleList()
		}
	}

	useEffect(() => {
		setShown(true)
	}, [events])

	return (
		<>
			<MinimizedButton onClick={handleShow} noClip>
				<ButtonIcon>
					<FontAwesomeIcon icon={faBell} />
				</ButtonIcon>
				<ButtonCount>{events.length}</ButtonCount>
			</MinimizedButton>
			{showList && <InYourFaceEventsList onClose={toggleList} />}

			{current && rendered && (
				<Portal>
					<DisplayContainer
						style={{ opacity: highlighted ? 0.1 : 1 }}
						$shown={shown}
					>
						<NextEvents
							style={{ marginTop: `-${events.slice(1, 5).length * 0.85}rem` }}
						>
							{events
								.slice(1, 5)
								.reverse()
								.map((e, i, a) => {
									const indexReversed = a.length - 1 - i

									return (
										<NextEvent
											key={`${i}-${e.type}`}
											style={{
												fontSize: `${1 - (indexReversed + 1) * 0.1}rem`,
												opacity: 1 - (indexReversed + 1) * 0.2,
												marginLeft: `${(indexReversed + 1) * 0.5}rem`,
												marginRight: `${(indexReversed + 1) * 0.5}rem`,
											}}
										>
											<InYourFaceEventTitle event={e} />
										</NextEvent>
									)
								})}
						</NextEvents>
						<Inner>
							<Actions>
								<ActionsInner align="center" gap="1rem">
									<Button
										icon={faChevronDown}
										onClick={toggleShown}
										schema="transparent"
									/>
									<ActionsSpacer />
									<span>{events.length}</span>
									<Button onClick={handleDismiss}>
										{events.length > 1 ? 'Next' : 'Dismiss'}
									</Button>
								</ActionsInner>
							</Actions>
							{/* TODO: Hotfix to reset animations for new events even when they're the same type - better solution? */}
							<Event key={JSON.stringify(current)}>
								<InYourFaceEvent event={current} />
							</Event>
							<div></div>
						</Inner>
					</DisplayContainer>
				</Portal>
			)}
		</>
	)
}

const popAnimation = keyframes`
	0% { max-width: 0rem; }
	100% { max-width: 35rem; }
`

const Inner = styled(ClippedBox)`
	> .inner {
		position: relative;
		max-height: 80%;
		box-sizing: border-box;
		padding: 0.5rem;
	}
`

const Actions = styled.div`
	width: 30rem;
	margin: 0 auto;
`

const ActionsInner = styled(Flex)`
	margin: 0 auto;
`

const ActionsSpacer = styled.div`
	flex: 1;
`

const Event = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const minimizeToTopLeft = keyframes`
	0% { transform: translate(-50%, -50%) scale(1); left: 50%; top: 50%; }
	100% { transform: translate(-50%, -50%) scale(0); left: 0; top: 0; }
`

const DisplayContainer = styled.div<{ $shown: boolean }>`
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background-color: rgba(0, 0, 0, 0.5);
	padding-top: 20vh;
	transition: background-color 0.2s;

	${(props) =>
		!props.$shown
			? css`
					background-color: rgba(0, 0, 0, 0);
					pointer-events: none;

					${Inner} {
						position: absolute;
						animation-name: ${minimizeToTopLeft};
						animation-duration: 0.2s;
						animation-iteration-count: 1;
						animation-fill-mode: forwards;
						transform: translate(-50%, -50%);
					}

					${NextEvents} {
						position: absolute;
						animation-name: ${minimizeToTopLeft};
						animation-duration: 0.2s;
						animation-iteration-count: 1;
						animation-fill-mode: forwards;
						transform: translate(-50%, -50%);
					}
				`
			: css`
					${Inner} {
						animation-name: ${popAnimation};
						animation-duration: 0.2s;
						animation-iteration-count: 1;
					}
				`}
`

const NextEvent = styled.div`
	background: ${({ theme }) => theme.colors.modalBackground};
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-bottom: none;
`

const NextEvents = styled.div`
	position: absolute;
	margin-top: -1rem;
	width: 30rem;
`

const MinimizedButton = styled(Button)`
	margin-top: 0.2rem;
	border: 2px solid ${({ theme }) => theme.colors.border};
	background-color: ${({ theme }) => theme.colors.background};
	display: flex;
	gap: 0.2rem;
	padding: 0;
`

const ButtonIcon = styled.div`
	background-color: ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
	margin: 0;
`

const ButtonCount = styled.div`
	margin: 0;
	padding: 0.5rem;
`
