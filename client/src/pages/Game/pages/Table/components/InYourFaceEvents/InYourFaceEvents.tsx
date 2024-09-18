import { Button } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { useAppStore } from '@/utils/hooks'
import { useGameEventsHandler } from '@/utils/useGameEventsHandler'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { EventType, GameEvent } from '../EventList/types'
import { CardPlayedEvent } from './components/CardPlayedEvent'
import { CardUsedEvent } from './components/CardUsedEvent'
import { NewGenerationEvent } from './components/NewGenerationEvent'
import { StandardProjectBoughtEvent } from './components/StandardProjectBoughtEvent'
import { PlayerDidHeader } from './components/PlayerDidHeader'
import { MilestoneBoughtEvent } from './components/MilestoneBoughtEvent'
import { CompetitionSponsoredEvent } from './components/CompetitionSponsoredEvent'
import { ColonyBuiltEvent } from './components/ColonyBuiltEvent'
import { ColonyTradingEvent } from './components/ColonyTradingEvent'
import { StartingSetupEvent } from './components/StartingSetupEvent'

const PROCESSABLE_EVENTS = [
	EventType.CardPlayed,
	EventType.CardUsed,
	EventType.NewGeneration,
	EventType.StandardProjectBought,
	EventType.MilestoneBought,
	EventType.CompetitionSponsored,
	EventType.ColonyBuilt,
	EventType.ColonyTrading,
	EventType.StartingSetup,
]

export const InYourFaceEvents = () => {
	const player = useAppStore((state) => state.game.player)
	const [events, setEvents] = useState<GameEvent[]>([])

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
			case EventType.NewGeneration:
				return <div style={{ textAlign: 'center' }}>New generation</div>
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
			case EventType.NewGeneration:
				return <NewGenerationEvent event={event} />
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
				<DisplayContainer>
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

						<div>{renderEvent(current)}</div>

						<Flex align="center" justify="flex-end" gap="1rem">
							<span>{events.length}</span>
							<Button onClick={handleDismiss}>
								{events.length > 1 ? 'Next' : 'Dismiss'}
							</Button>
						</Flex>
					</Inner>
				</DisplayContainer>
			)}
		</>
	)
}

const Inner = styled.div`
	position: relative;
	background: ${({ theme }) => theme.colors.modalBackground};
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
`

const DisplayContainer = styled.div`
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
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
