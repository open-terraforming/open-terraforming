import React, { useState, useCallback } from 'react'
import { useAppStore } from '@/utils/hooks'
import styled from 'styled-components'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { EndGame } from './EndGame/EndGame'
import { Button } from '@/components'

export const GlobalState = () => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)
	const [showEnd, setShowEnd] = useState(true)

	const handleShow = useCallback(() => {
		setShowEnd(true)
	}, [])

	const handleHide = useCallback(() => {
		setShowEnd(false)
	}, [])

	return game && player ? (
		<Container>
			<div>Game State: {game && GameStateValue[game?.state]}</div>
			<div>
				Player State: {player && PlayerStateValue[player.gameState.state]}
			</div>
			<div>Generation: {game?.generation}</div>
			<div>Temperature: {game?.temperature}°</div>
			<div>Oxygen: {game?.oxygen} %</div>
			<div>Oceans: {game?.oceans}</div>

			{game.state === GameStateValue.Ended && (
				<>
					<Button onClick={handleShow}>Show result</Button>
					{showEnd && <EndGame onClose={handleHide} />}
				</>
			)}
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	margin-left: auto;
	background-color: rgba(14, 129, 214, 0.8);
	padding: 0.5rem;
	margin-top: 5rem;
`
