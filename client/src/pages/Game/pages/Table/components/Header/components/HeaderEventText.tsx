import React, { useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
	MilestoneBought,
	CompetitionSponsored,
	EventType
} from '../../EventList/types'
import { Competitions } from '@shared/competitions'
import { Milestones } from '@shared/milestones'
import { useAppStore } from '@/utils/hooks'
import { rgba } from 'polished'

export type HeaderEvent = (MilestoneBought | CompetitionSponsored) & {
	id: number
}

type Props = {
	ev: HeaderEvent
	onDone: () => void
}

export const HeaderEventText = ({ ev, onDone }: Props) => {
	const playerMap = useAppStore(state => state.game.playerMap)

	useEffect(() => {
		setTimeout(() => {
			onDone()
		}, 5000)
	}, [])

	return (
		<Display color="#EEE64D">
			{ev.type === EventType.CompetitionSponsored &&
				`${playerMap[ev.playerId]?.name} sponsored ${
					Competitions[ev.competition]?.title
				}`}
			{ev.type === EventType.MilestoneBought &&
				`${playerMap[ev.playerId]?.name} bought ${
					Milestones[ev.milestone]?.title
				}`}
		</Display>
	)
}

const PopIn = keyframes`
	0% { top: 10%; opacity: 0; }
	30% { top: 10%; opacity: 1; }
	70% { top: 10%; opacity: 1; }
	100% { top: -20%; opacity: 0; }
`

const Display = styled.div<{ color: string }>`
	position: absolute;
	left: 50%;
	top: 10%;

	margin-left: -250px;
	width: 500px;
	text-align: center;

	z-index: 1000;

	animation-name: ${PopIn};
	animation-duration: 4000ms;
	animation-fill-mode: forwards;

	color: #111;

	padding: 0.5rem 0;

	${props => css`
		background: linear-gradient(
			to right,
			${rgba(props.color, 0)} 0%,
			${rgba(props.color, 1)} 20%,
			${rgba(props.color, 1)} 80%,
			${rgba(props.color, 0)} 100%
		);
	`}
`
