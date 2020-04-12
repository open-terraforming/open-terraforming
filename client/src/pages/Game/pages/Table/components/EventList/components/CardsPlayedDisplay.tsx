import { useAppStore } from '@/utils/hooks'
import React, { useEffect, useState } from 'react'
import { CardPlayed, CardUsed, EventType, GameEvent } from '../types'
import { filterEvents } from '../utils'
import { CardModal } from './CardModal'

type Props = {
	events: GameEvent[]
}

type CardEvent = CardPlayed | CardUsed

export const CardsPlayedDisplay = ({ events }: Props) => {
	const playerMap = useAppStore(state => state.game.playerMap)
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
				]) as (CardPlayed | CardUsed)[]).filter(e => e.playerId !== playerId)
			])

			setProcessed(events.length)
		}
	}, [events])

	return (
		<>
			{cardsPlayed.map(c => (
				<CardModal
					key={`${c.card}_${c.type}`}
					card={c.card}
					title={
						c.type === EventType.CardPlayed
							? `Card played by ${playerMap[c.playerId].name}`
							: `Action played by ${playerMap[c.playerId].name}`
					}
					onClose={() => setCardsPlayed(e => e.filter(i => i !== c))}
				/>
			))}
		</>
	)
}
