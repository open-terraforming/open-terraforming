import { Button, Portal } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useAppStore } from '@/utils/hooks'
import { useGameEventsHandler } from '@/utils/useGameEventsHandler'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { CardPlayedEvent } from './components/CardPlayedEvent'
import { CardUsedEvent } from './components/CardUsedEvent'
import { ColonyBuiltEvent } from './components/ColonyBuiltEvent'
import { ColonyTradingEvent } from './components/ColonyTradingEvent'
import { CompetitionSponsoredEvent } from './components/CompetitionSponsoredEvent'
import { MilestoneBoughtEvent } from './components/MilestoneBoughtEvent'
import { PlayerDidHeader } from './components/PlayerDidHeader'
import { StandardProjectBoughtEvent } from './components/StandardProjectBoughtEvent'
import { StartingSetupEvent } from './components/StartingSetupEvent'
import { ProductionDoneEvent } from './components/ProductionDoneEvent'
import { TilePlacedEvent } from './components/TilePlacedEvent'
import { EventType, GameEvent } from '@shared/index'

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
]

export const InYourFaceEvents = () => {
	const player = useAppStore((state) => state.game.player)
	const [events, setEvents] = useState<GameEvent[]>([])
	const [opacity, setOpacity] = useState(1)

	const current = events[0]

	useGameEventsHandler((event) => {
		if ('playerId' in event && event.playerId === player.id) {
			return
		}

		if (PROCESSABLE_EVENTS.includes(event.type)) {
			setEvents((events) => [...events, event])
		}
	})

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
			default:
				return null
		}
	}, [])

	const handleDismiss = useCallback(() => {
		setEvents((events) => events.slice(1))
	}, [])

	return (
		<>
			{current && (
				<Portal>
					<DisplayContainer style={{ opacity }}>
						<Inner>
							<NextEvents>
								{events
									.slice(1, 5)
									.reverse()
									.map((e, i, a) => {
										const indexReversed = a.length - 1 - i

										return (
											<NextEvent
												key={`${i}-${e.type}`}
												style={{
													/*transform: `scale(${1 - (Math.min(4, events.length + 1) - i + 1) * 0.1})`,*/
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
							<Actions>
								<ActionsInner align="center" justify="flex-end" gap="1rem">
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
						</Inner>
					</DisplayContainer>
				</Portal>
			)}
		</>
	)
}

const Inner = styled.div`
	position: relative;
	background: ${({ theme }) => theme.colors.modalBackground};
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
	max-height: 80%;
`

const Actions = styled.div`
	width: 30rem;
`

const ActionsInner = styled(Flex)`
	margin: 0 auto;
`

const Event = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const DisplayContainer = styled.div`
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background-color: rgba(0, 0, 0, 0.5);
	padding-top: 20%;
`

const NextEvent = styled.div`
	background: ${({ theme }) => theme.colors.modalBackground};
	border: 2px solid ${({ theme }) => theme.colors.border};
`

const NextEvents = styled.div`
	position: absolute;
	bottom: 100%;
	left: 0;
	right: 0;
`

const CenterText = styled.div`
	text-align: center;
`
