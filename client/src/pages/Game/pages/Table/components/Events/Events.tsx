import React, { useState, useEffect } from 'react'
import { PlayingChanged } from './components/PlayingChanged'
import { effect } from '@shared/cards/utils'
import { useAppStore } from '@/utils/hooks'
import { objDiff } from '@/utils/collections'
import { GameState } from '@shared/index'
import { GenerationChanged } from './components/GenerationChanged'

type Props = {}

enum EventType {
	PlayingChanged,
	NewGeneration
}

type PlayingChanged = {
	type: typeof EventType.PlayingChanged
	playing: number
}

type NewGeneration = {
	type: typeof EventType.NewGeneration
}
type Event = PlayingChanged | NewGeneration

export const Events = ({}: Props) => {
	const [events, setEvents] = useState([] as Event[])
	const game = useAppStore(state => state.game.state)
	const [lastGame, setLastGame] = useState(game)

	const effectDone = () => {
		setEvents(events.slice(1))
	}

	useEffect(() => {
		if (game && lastGame) {
			const diff = objDiff(lastGame, game) as GameState
			const newEvents = [] as Event[]

			if (diff.currentPlayer !== undefined) {
				newEvents.push({
					type: EventType.PlayingChanged,
					playing: diff.currentPlayer
				})
			}

			if (diff.generation !== undefined) {
				newEvents.push({
					type: EventType.NewGeneration
				})
			}

			if (newEvents.length > 0) {
				setEvents([...events, ...newEvents])
			}
		}

		setLastGame(game)
	}, [game])

	if (events.length > 0) {
		switch (events[0].type) {
			case EventType.PlayingChanged: {
				return (
					<PlayingChanged
						key={events[0].playing}
						playing={events[0].playing}
						onDone={effectDone}
					/>
				)
			}

			case EventType.NewGeneration: {
				return <GenerationChanged onDone={effectDone} />
			}
		}
	}

	return <></>
}
