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

const PROCESSABLE_EVENTS = [EventType.CardPlayed, EventType.CardUsed]

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
						{events.slice(1, 5).map((e, i) => (
							<FakeContainer
								key={i}
								style={{
									position: 'absolute',
									left: -(10 + i * 10),
									opacity: 0.6 - i * 0.1,
									// transform: `scale(${1 - (i + 1) * 0.05})`,
									transformOrigin: 'left',
									zIndex: -1,
								}}
							>
								{renderEvent(e)}
							</FakeContainer>
						))}

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

const FakeContainer = styled.div`
	background: ${({ theme }) => theme.colors.modalBackground};
	border: 2px solid ${({ theme }) => theme.colors.border};
	padding: 0.5rem;
	position: relative;
`
