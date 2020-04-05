import { objDiff, keyMap } from '@/utils/collections'
import { useAppStore, useInterval } from '@/utils/hooks'
import { CardsLookupApi, GameProgress, Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { GameState } from '@shared/index'
import React, { useEffect, useState, useMemo } from 'react'
import { EventType, GameEvent } from './types'
import styled from 'styled-components'
import { EventLine } from './components/EventLine'
import { EventsModal } from './components/EventsModal'
import { Button } from '@/components'

type Props = {}

const resources: Resource[] = [
	'money',
	'ore',
	'titan',
	'plants',
	'energy',
	'heat'
]

type DisplayedEvent = {
	id: number
	event: GameEvent
}

const progress: GameProgress[] = ['oxygen', 'temperature']

export const EventList = ({}: Props) => {
	const game = useAppStore(state => state.game.state)
	const [events, setEvents] = useState([] as GameEvent[])
	const [lastDisplayed, setLastDisplayed] = useState(0 as number)
	const [displayedEvents, setDisplayedEvents] = useState([] as DisplayedEvent[])
	const [lastGame, setLastGame] = useState(game)
	const [displayModal, setDisplayModal] = useState(false)

	useInterval(() => {
		if (lastDisplayed < events.length) {
			setDisplayedEvents(e => [
				{ id: lastDisplayed, event: events[lastDisplayed] },
				...e
			])

			setLastDisplayed(e => e + 1)
		}
	}, 250)

	const handleDone = () => {
		setDisplayedEvents(d => d.slice(0, d.length - 1))
	}

	/*
	useEffect(() => {
		if (events.length > 100) {
			setEvents(events.slice(events.length - 100))
		}
	}, [events])
	*/

	useEffect(() => {
		if (game && lastGame) {
			const diff = objDiff(lastGame, game) as GameState
			const newEvents = [] as GameEvent[]

			if (diff.players) {
				Object.entries(diff.players).forEach(([playerIndex, changes]) => {
					const player = lastGame.players[parseInt(playerIndex)]
					const newPlayer = game.players[parseInt(playerIndex)]

					const gameChanges = changes.gameState

					if (gameChanges) {
						if (gameChanges.usedCards) {
							Object.entries(gameChanges.usedCards).forEach(
								([cardIndex, cardChanges]) => {
									const oldCard =
										player.gameState.usedCards[parseInt(cardIndex)]

									if (!oldCard) {
										newEvents.push({
											type: EventType.CardPlayed,
											playerId: player.id,
											card: cardChanges.code
										})
									} else {
										const card = CardsLookupApi.get(oldCard.code)

										if (card.resource && cardChanges[card.resource]) {
											newEvents.push({
												type: EventType.CardResourceChanged,
												playerId: player.id,
												card: cardChanges.code,
												resource: card.resource,
												index: parseInt(cardIndex),
												amount:
													cardChanges[card.resource] - oldCard[card.resource]
											})
										}

										if (cardChanges.played === true) {
											newEvents.push({
												type: EventType.CardUsed,
												playerId: player.id,
												card: oldCard.code,
												index: parseInt(cardIndex)
											})
										}
									}
								}
							)
						}

						if (gameChanges.terraformRating) {
							newEvents.push({
								type: EventType.RatingChanged,
								playerId: player.id,
								amount:
									gameChanges.terraformRating - player.gameState.terraformRating
							})
						}

						resources.forEach(res => {
							const prod = resourceProduction[res]

							if (gameChanges[res] !== undefined) {
								newEvents.push({
									type: EventType.ResourceChanged,
									playerId: player.id,
									resource: res,
									amount: gameChanges[res] - player.gameState[res]
								})
							}

							if (gameChanges[prod] !== undefined) {
								newEvents.push({
									type: EventType.ProductionChanged,
									playerId: player.id,
									resource: res,
									amount: gameChanges[prod] - player.gameState[prod]
								})
							}
						})

						if (gameChanges.corporation) {
							newEvents.push({
								type: EventType.CorporationPicked,
								playerId: player.id,
								corporation: gameChanges.corporation
							})
						}

						if (gameChanges.cards) {
							const diff = newPlayer.gameState.cards.filter(
								c => !player.gameState.cards.includes(c)
							).length

							if (diff > 0) {
								newEvents.push({
									type: EventType.CardsReceived,
									playerId: player.id,
									amount: diff
								})
							}
						}
					}
				})
			}

			progress.forEach(p => {
				if (diff[p]) {
					newEvents.push({
						type: EventType.GameProgressChanged,
						progress: p,
						amount: diff[p] - lastGame[p]
					})
				}
			})

			const tiles = diff.map?.grid

			if (tiles) {
				Object.entries(tiles).forEach(([, row]) => {
					Object.entries(row).forEach(([, cellChange]) => {
						if (cellChange.content) {
							newEvents.push({
								type: EventType.TilePlaced,
								playerId: cellChange.ownerId as number,
								tile: cellChange.content
							})
						}
					})
				})
			}

			if (diff.competitions) {
				Object.values(diff.competitions).forEach(c => {
					newEvents.push({
						type: EventType.CompetitionSponsored,
						playerId: c.playerId,
						competition: c.type
					})
				})
			}

			if (diff.milestones) {
				Object.values(diff.milestones).forEach(c => {
					newEvents.push({
						type: EventType.MilestoneBought,
						playerId: c.playerId,
						milestone: c.type
					})
				})
			}

			if (newEvents.length > 0) {
				setEvents([...events, ...newEvents])
			}
		}

		setLastGame(game)
	}, [game])

	const playerMap = useMemo(() => (game ? keyMap(game.players, 'id') : {}), [
		game
	])

	return (
		<Centered>
			{displayModal && (
				<EventsModal
					events={events}
					players={playerMap}
					onClose={() => setDisplayModal(false)}
				/>
			)}
			{displayedEvents.map(e => (
				<EventLine
					event={e.event}
					key={e.id}
					players={playerMap}
					animated={true}
					onDone={handleDone}
				/>
			))}
			<Button onClick={() => setDisplayModal(true)}>Event log</Button>
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
`
