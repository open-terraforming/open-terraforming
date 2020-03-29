import React from 'react'
import { useAppStore } from '@/utils/hooks'
import styled from 'styled-components'
import { GameStateValue, PlayerStateValue } from '@shared/index'

export const GlobalState = () => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)

	return (
		<Container>
			<div>Game State: {game && GameStateValue[game?.state]}</div>
			<div>
				Player State: {player && PlayerStateValue[player.gameState.state]}
			</div>
			<div>Generation: {game?.generation}</div>
			<div>Temperature: {game?.temperature}°</div>
			<div>Oxygen: {game?.oxygen} %</div>
			<div>Oceans: {game?.oceans}</div>
		</Container>
	)
}

const Container = styled.div`
	margin-left: auto;
	background-color: rgba(14, 129, 214, 0.8);
	padding: 0.5rem;
	margin-top: 5rem;
`
