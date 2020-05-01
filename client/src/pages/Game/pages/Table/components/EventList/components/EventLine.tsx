import React, { useMemo, useEffect, useRef, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { EventType, GameEvent } from '../types'
import { PlayerState, GridCellContent, GridCellOther } from '@shared/index'
import { CardsLookupApi } from '@shared/cards'
import { withUnits } from '@shared/units'
import { ucFirst } from '@shared/utils'
import { lighten } from 'polished'
import { CardModal } from './CardModal'
import { Competitions } from '@shared/competitions'
import { Milestones } from '@shared/milestones'
import { useAppStore } from '@/utils/hooks'

type Props = {
	event: GameEvent
	animated: boolean
	onDone?: () => void
}

const PlayerSpan = ({ player }: { player: PlayerState }) => (
	<span style={{ color: player && lighten(0.2, player.color) }}>
		{player?.name}
	</span>
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

export const EventLine = ({ event, animated, onDone }: Props) => {
	const players = useAppStore(state => state.game.playerMap)
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
						<PlayerSpan player={players[event.playerId]} /> bought{' '}
						<CardSpan card={event.card} />
					</>
				)
			case EventType.CardUsed:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} /> played{' '}
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
						{` picked ${CardsLookupApi.get(event.corporation).title}`}
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
						<CardSpanE>
							{event.other !== undefined
								? GridCellOther[event.other]
								: GridCellContent[event.tile]}
						</CardSpanE>
					</>
				)
			case EventType.CompetitionSponsored:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` sponsored ${Competitions[event.competition].title} competition`}
					</>
				)
			case EventType.MilestoneBought:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />
						{` bought ${Milestones[event.milestone].title} milestone`}
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
			/*
			case EventType.CardResourceChanged:
				return (
					<>
						<PlayerSpan player={players[event.playerId]} />{' '}
						{CardsLookupApi.get(event.card).title}{' '}
						{event.amount > 0 ? '+' : '-'}
						{event.amount} {event.resource}
					</>
				)
			*/
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
