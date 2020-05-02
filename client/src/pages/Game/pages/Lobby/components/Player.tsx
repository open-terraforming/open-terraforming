import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pickColor } from '@shared/index'
import { PlayerColors } from '@shared/player-colors'
import React from 'react'
import styled, { css } from 'styled-components'
import { ColorPicker } from './ColorPicker'
import { mainColors } from '@/styles'

type Props = {
	name: string
	color: string
	ready: boolean
	current: boolean
	bot: boolean
}

export const Player = ({ name, ready, color, current, bot }: Props) => {
	const api = useApi()

	const playerId = useAppStore(state => state.game.playerId)

	const pickedColors =
		useAppStore(state =>
			state.game.state?.players.filter(p => p.id !== playerId).map(p => p.color)
		) || []

	const colors = PlayerColors.map((c, i) => [i, c] as const)
		.filter(([, c]) => !pickedColors.includes(c))
		.map(([i]) => i)

	const colorIndex = PlayerColors.indexOf(color)

	const changeColor = (i: number) => {
		api.send(pickColor(i))
	}

	return (
		<PlayerContainer>
			<Picker>
				<ColorPicker
					value={colorIndex}
					colors={colors}
					readOnly={!current || ready}
					onChange={v => {
						changeColor(v)
					}}
				/>
			</Picker>
			<span>{name}</span>
			{!bot && (
				<PlayerState ready={ready}>{ready ? 'Ready' : 'Waiting'}</PlayerState>
			)}
			{bot && (
				<PlayerState ready>
					<FontAwesomeIcon icon={faRobot} color={mainColors.text} />
				</PlayerState>
			)}
		</PlayerContainer>
	)
}

const PlayerContainer = styled.div`
	display: flex;
	align-items: center;
`

const PlayerState = styled.div<{ ready: boolean }>`
	padding: 0.25rem;
	margin-left: auto;

	${props => css`
		color: ${props.ready ? '#33ff33' : '#999'};
	`}
`

const Picker = styled.div`
	width: 3rem;
	max-width: 3rem;
	display: flex;
	justify-content: center;
`
