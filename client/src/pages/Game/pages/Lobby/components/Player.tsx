import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { ColorPicker } from './ColorPicker'
import { useAppStore } from '@/utils/hooks'
import { PlayerColors } from '@shared/player-colors'
import { useApi } from '@/context/ApiContext'
import { pickColor } from '@shared/index'

type Props = {
	name: string
	color: string
	ready: boolean
	current: boolean
}

export const Player = ({ name, ready, color, current }: Props) => {
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
			<ColorPicker
				value={colorIndex}
				colors={colors}
				readOnly={!current}
				onChange={v => {
					changeColor(v)
				}}
			/>
			<span>{name}</span>
			<PlayerState ready={ready}>{ready ? 'Ready' : 'Waiting'}</PlayerState>
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
