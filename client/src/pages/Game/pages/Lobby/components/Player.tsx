import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { faRobot, faBan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { pickColor, kickPlayer } from '@shared/index'
import { PlayerColors } from '@shared/player-colors'
import React from 'react'
import styled, { css } from 'styled-components'
import { ColorPicker } from './ColorPicker'
import { colors as themeColors } from '@/styles'
import { Button } from '@/components'

type Props = {
	id: number
	name: string
	color: string
	ready: boolean
	current: boolean
	bot: boolean
}

export const Player = ({ id, name, ready, color, current, bot }: Props) => {
	const api = useApi()

	const currentPlayer = useAppStore(state => state.game.player)

	const pickedColors =
		useAppStore(state =>
			state.game.state.players
				.filter(p => p.id !== currentPlayer.id)
				.map(p => p.color)
		) || []

	const colors = PlayerColors.map((c, i) => [i, c] as const)
		.filter(([, c]) => !pickedColors.includes(c))
		.map(([i]) => i)

	const colorIndex = PlayerColors.indexOf(color)

	const changeColor = (i: number) => {
		api.send(pickColor(i))
	}

	const handleKick = () => {
		api.send(kickPlayer(id))
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
			{currentPlayer.owner && !current && (
				<KickButton onClick={handleKick} icon={faBan}>
					Kick
				</KickButton>
			)}
			{bot && (
				<PlayerState ready>
					<FontAwesomeIcon icon={faRobot} color={themeColors.text} />
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

const KickButton = styled(Button)`
	margin-left: 0.5rem;
	padding: 0.1rem 0.2rem;
`
