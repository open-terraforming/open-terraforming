import { useAppStore } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CardPlayed, CardUsed, EventType, GameEvent } from '../types'
import { filterEvents } from '../utils'
import { CardEvent, PlayedCard } from './PlayedCard'

type Props = {
	events: GameEvent[]
}

export const CardsPlayedDisplay = ({ events }: Props) => {
	const playerId = useAppStore(state => state.game.playerId)
	const [processed, setProcessed] = useState(0)
	const [cardsPlayed, setCardsPlayed] = useState([] as CardEvent[])

	useEffect(() => {
		if (events.length > processed) {
			setCardsPlayed(e => [
				...e,
				...(filterEvents(events.slice(processed), [
					EventType.CardPlayed,
					EventType.CardUsed
				]) as (CardPlayed | CardUsed)[])
					.map((e, i) => ({ ...e, id: processed + i }))
					.filter(e => e.playerId !== playerId)
			])

			setProcessed(events.length)
		}
	}, [events])

	const displayed = Math.min(5, cardsPlayed.length)

	return (
		<E>
			{cardsPlayed
				.slice(0, displayed)
				.reverse()
				.map((c, i) => (
					<PlayedCard
						key={c.id}
						event={c}
						index={i}
						length={displayed}
						onRemove={() => {
							setCardsPlayed(e => e.filter(i => i !== c))
						}}
					/>
				))}
		</E>
	)
}

const E = styled.div`
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 5;
`
