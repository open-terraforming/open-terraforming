import { Button, Portal } from '@/components'
import { ClippedBox } from '@/components/ClippedBox'
import { Flex } from '@/components/Flex/Flex'
import { useAppStore, useToggle } from '@/utils/hooks'
import { useGameEventsHandler } from '@/utils/useGameEventsHandler'
import { faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EventType, GameEvent } from '@shared/index'
import { useCallback, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { CardPlayedEvent } from './components/CardPlayedEvent'
import { CardUsedEvent } from './components/CardUsedEvent'
import { ColonyBuiltEvent } from './components/ColonyBuiltEvent'
import { ColonyTradingEvent } from './components/ColonyTradingEvent'
import { CompetitionSponsoredEvent } from './components/CompetitionSponsoredEvent'
import { CurrentGlobalEventExecutedEvent } from './components/CurrentGlobalEventExecuted'
import { GlobalEventsChangedEvent } from './components/GlobalEventsChangedEvent'
import { MarsTerraformedEvent } from './components/MarsTerraformedEvent'
import { MilestoneBoughtEvent } from './components/MilestoneBoughtEvent'
import { NewGovernmentEvent } from './components/NewGovernmentEvent'
import { PlayerDidHeader } from './components/PlayerDidHeader'
import { PlayerMovedDelegateEvent } from './components/PlayerMovedDelegateEvent'
import { ProductionDoneEvent } from './components/ProductionDoneEvent'
import { StandardProjectBoughtEvent } from './components/StandardProjectBoughtEvent'
import { StartingSetupEvent } from './components/StartingSetupEvent'
import { TilePlacedEvent } from './components/TilePlacedEvent'

const PROCESSABLE_EVENTS = [
	EventType.CardPlayed,
	EventType.CardUsed,
	EventType.StandardProjectBought,
	EventType.MilestoneBought,
	EventType.CompetitionSponsored,
	EventType.ColonyBuilt,
	EventType.ColonyTrading,
	EventType.StartingSetup,
	EventType.ProductionDone,
	EventType.TilePlaced,
	EventType.MarsTerraformed,
	EventType.GlobalEventsChanged,
	EventType.CurrentGlobalEventExecuted,
	EventType.NewGovernment,
	EventType.PlayerMovedDelegate,
]

export const InYourFaceEvents = () => {
	const player = useAppStore((state) => state.game.player)
	const [shown, toggleShown, setShown] = useToggle()
	const [rendered, setRendered] = useState(false)
	const [events, setEvents] = useState<GameEvent[]>([])
	const [opacity, setOpacity] = useState(1)

	const current = events[0]

	useGameEventsHandler((event) => {
		if ('playerId' in event && event.playerId === player.id) {
			return
		}

		if (event.processed) {
			return
		}

		if (PROCESSABLE_EVENTS.includes(event.type)) {
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

	const renderEventHead = useCallback((event: GameEvent) => {
		switch (event.type) {
			case EventType.CardPlayed:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" played card"
					/>
				)
			case EventType.CardUsed:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" used card"
					/>
				)
			case EventType.CompetitionSponsored:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" sponsored competition"
					/>
				)
			case EventType.MilestoneBought:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" bought milestone"
					/>
				)
			case EventType.ColonyBuilt:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" built colony"
					/>
				)
			case EventType.ColonyTrading:
				return (
					<PlayerDidHeader
						noSpacing
						playerId={event.playerId}
						thing=" traded with colony"
					/>
				)
			case EventType.StandardProjectBought:
				return (
					<PlayerDidHeader
						playerId={event.playerId}
						noSpacing
						thing=" bought standard project"
					/>
				)
			case EventType.StartingSetup:
				return (
					<PlayerDidHeader
						playerId={event.playerId}
						noSpacing
						thing=" picked their starting setup"
					/>
				)
			case EventType.TilePlaced:
				return (
					<PlayerDidHeader
						playerId={event.playerId}
						noSpacing
						thing=" placed tile"
					/>
				)
			case EventType.ProductionDone:
				return <CenterText>Production</CenterText>
			case EventType.MarsTerraformed:
				return <CenterText>Mars terraformed</CenterText>
			case EventType.GlobalEventsChanged:
				return <CenterText>Global events changed</CenterText>
			case EventType.CurrentGlobalEventExecuted:
				return <CenterText>Global event executed</CenterText>
			case EventType.NewGovernment:
				return <CenterText>New government</CenterText>
			case EventType.PlayerMovedDelegate:
				return (
					<PlayerDidHeader
						playerId={event.playerId}
						noSpacing
						thing=" placed delegate"
					/>
				)
			default:
				return null
		}
	}, [])

	const renderEvent = useCallback((event: GameEvent) => {
		switch (event.type) {
			case EventType.CardPlayed:
				return <CardPlayedEvent event={event} />
			case EventType.CardUsed:
				return <CardUsedEvent event={event} />
			case EventType.StandardProjectBought:
				return <StandardProjectBoughtEvent event={event} />
			case EventType.MilestoneBought:
				return <MilestoneBoughtEvent event={event} />
			case EventType.CompetitionSponsored:
				return <CompetitionSponsoredEvent event={event} />
			case EventType.ColonyBuilt:
				return <ColonyBuiltEvent event={event} />
			case EventType.ColonyTrading:
				return <ColonyTradingEvent event={event} />
			case EventType.StartingSetup:
				return <StartingSetupEvent event={event} />
			case EventType.ProductionDone:
				return <ProductionDoneEvent event={event} />
			case EventType.TilePlaced:
				return <TilePlacedEvent event={event} onOpacityChange={setOpacity} />
			case EventType.MarsTerraformed:
				return <MarsTerraformedEvent />
			case EventType.GlobalEventsChanged:
				return <GlobalEventsChangedEvent event={event} />
			case EventType.CurrentGlobalEventExecuted:
				return <CurrentGlobalEventExecutedEvent event={event} />
			case EventType.NewGovernment:
				return <NewGovernmentEvent event={event} />
			case EventType.PlayerMovedDelegate:
				return <PlayerMovedDelegateEvent event={event} />
			default:
				return null
		}
	}, [])

	const handleDismiss = useCallback(() => {
		setEvents((events) => events.slice(1))
	}, [])

	useEffect(() => {
		setShown(true)
	}, [events])

	return (
		<>
			<MinimizedButton onClick={toggleShown} noClip>
				<ButtonIcon>
					<FontAwesomeIcon icon={faBell} />
				</ButtonIcon>
				<ButtonCount>{events.length}</ButtonCount>
			</MinimizedButton>
			{current && rendered && (
				<Portal>
					<DisplayContainer style={{ opacity }} $shown={shown}>
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
											{renderEventHead(e)}
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
								{renderEvent(current)}
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

const CenterText = styled.div`
	text-align: center;
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
