import React, { useMemo, useEffect, useRef, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { EventType, GameEvent } from '../types'
import { PlayerState, GridCellContent } from '@shared/index'
import { CardsLookupApi } from '@shared/cards'
import { withUnits } from '@shared/units'
import { ucFirst } from '@shared/utils'
import { CorporationsLookup } from '@shared/corporations'
import { lighten } from 'polished'
import { CardModal } from './CardModal'

type Props = {
	event: GameEvent
	players: Record<number, PlayerState>
	animated: boolean
	onDone?: () => void
}

const PlayerSpan = ({ player }: { player: PlayerState }) => (
	<span style={{ color: lighten(0.2, player.color) }}>{player.name}</span>
)

const CardSpan = React.memo(({ card }: { card: string }) => {
	const [shown, setShown] = useState(false)

	return (
		<>
			{shown && <CardModal card={card} onClose={() => setShown(false)} />}
			<CardSpanE onClick={() => setShown(true)}>
				{CardsLookupApi.get(card).title}
			</CardSpanE>
		</>
	)
})

export const EventLine = ({ event, players, animated, onDone }: Props) => {
	const doneRef = useRef(onDone)
	doneRef.current = onDone

	useEffect(() => {
		if (animated) {
			setTimeout(() => {
				doneRef.current && doneRef.current()
			}, 7000)
		}
	}, [])

	const content = useMemo(() => {
		switch (event.type) {
			case EventType.CardPlayed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> played{' '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.CardUsed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> used{' '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.CardsReceived:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` got ${event.amount} cards`}
					</>
				)
			case EventType.RatingChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` + ${event.amount} TR`}
					</>
				)
			case EventType.CorporationPicked:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` picked ${CorporationsLookup[event.corporation]?.name}`}
					</>
				)
			case EventType.ResourceChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						<ResourceE positive={event.amount > 0}>
							{event.amount > 0 ? ' +' : ' -'}
							{withUnits(event.resource, Math.abs(event.amount))}
						</ResourceE>
					</>
				)
			case EventType.ProductionChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						<ResourceE positive={event.amount > 0}>
							{event.amount > 0 ? ' +' : ' -'}
							{withUnits(event.resource, Math.abs(event.amount))}
							{' production'}
						</ResourceE>
					</>
				)
			case EventType.TilePlaced:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{' placed '}
						<CardSpanE>{GridCellContent[event.tile]}</CardSpanE>
					</>
				)
			case EventType.GameProgressChanged:
				return (
					<>
						{ucFirst(event.progress)}
						{event.amount > 0 ? ' +' : ' -'}
						<ResourceE positive={event.amount > 0}>
							{withUnits(event.progress, Math.abs(event.amount))}
						</ResourceE>
					</>
				)
		}
	}, [event, players])

	return <E animation={animated}>{content}</E>
}

const E = styled.div<{ animation: boolean }>`
	overflow: hidden;

	${props =>
		props.animation &&
		css`
			animation-name: ${Animation};
			animation-duration: 7000ms;
			animation-fill-mode: forwards;
		`}
`

const Animation = keyframes`
	0% { transform: translate(0, -100px); opacity: 0; }
	10% { transform: translate(0, 0); opacity: 1; }
	90% { transform: translate(0, 0) scaleY(1); opacity: 1; max-height: 50px; }
	100% { transform: translate(-300px, 0) scaleY(0); opacity: 0; max-height: 0; }
`

const CardSpanE = styled.span`
	color: #91c8ff;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`

const ResourceE = styled.span<{ positive: boolean }>`
	color: ${props => (props.positive ? '#86F09B' : '#F5AF7C')};
`