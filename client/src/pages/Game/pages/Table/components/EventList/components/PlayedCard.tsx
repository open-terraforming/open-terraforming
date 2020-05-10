import React, { useState, useEffect } from 'react'
import { EventType, CardPlayed, CardUsed } from '../types'
import { CardView } from '../../CardView/CardView'
import { CardsLookupApi } from '@shared/cards'
import styled, { keyframes, css } from 'styled-components'
import { useAppStore } from '@/utils/hooks'
import { colors, mainColors } from '@/styles'
import { rgba } from 'polished'

export type CardEvent = (CardPlayed | CardUsed) & { id: number }

type Props = {
	event: CardEvent
	index: number
	length: number
	onRemove: (e: CardEvent) => void
}

export const PlayedCard = ({ index, length, event, onRemove }: Props) => {
	const playerMap = useAppStore(state => state.game.playerMap)
	const ratio = length > 1 ? index / (length - 1) : 1
	const [removing, setRemoving] = useState(false)
	const [spawning, setSpawning] = useState(false)
	const player = playerMap[event.playerId]

	useEffect(() => {
		setTimeout(() => {
			setSpawning(true)
		}, 1000)
	}, [])

	return (
		<Played
			removing={removing}
			spawning={spawning}
			style={{
				opacity: spawning ? 0.3 + ratio * 0.7 : 1,
				left: spawning
					? ratio < 0
						? -200
						: 100 - (length - 1 - index) * 30
					: window.innerWidth / 2,
				bottom: spawning ? 0 : '30vh',
				transform: !spawning ? 'translate(-50%, 0) scale(1)' : undefined
			}}
			onClick={() => {
				if (!removing) {
					setRemoving(true)

					setTimeout(() => {
						onRemove(event)
					}, 200)
				}
			}}
		>
			<Title style={{ opacity: index !== length - 1 ? 0 : 1 }}>
				<Player style={{ color: player?.color }}>{player?.name}</Player>{' '}
				{event.type === EventType.CardPlayed ? `bought` : `played action of`}
			</Title>
			<StyledCard
				card={CardsLookupApi.get(event.card)}
				evaluate={false}
				hover={false}
			/>
		</Played>
	)
}

const PopOut = keyframes`
	0% {
		transform: translate(0, 0);
		opacity: 1;
	}
	100% {
		transform: translate(0, -300px);
		opacity: 0;
	}
`

const Player = styled.span`
	/*text-shadow: 1px 1px 2px ${mainColors.text};*/
`

const Title = styled.div`
	text-align: center;
`

const Played = styled.div<{ removing: boolean; spawning: boolean }>`
	position: absolute;
	bottom: 0;
	transform: scale(0.6);
	transform-origin: bottom center;
	transition: transform 0.2s, margin 0.2s, opacity 0.2s, left 0.5s, bottom 0.5s;
	z-index: 0;
	overflow: hidden;
	opacity: 1;

	&:hover {
		transform: scale(1);
		z-index: 1;
		opacity: 1 !important;

		${Title} {
			opacity: 1 !important;
		}
	}

	${props =>
		props.removing &&
		css`
			animation-name: ${PopOut};
			animation-duration: 200ms;
			animation-fill-mode: forwards;
		`}
`

const StyledCard = styled(CardView)`
	background-color: ${rgba(colors.background, 1)};
`
