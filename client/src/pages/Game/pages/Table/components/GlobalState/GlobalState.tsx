import React, { useState, useCallback } from 'react'
import { useAppStore } from '@/utils/hooks'
import styled from 'styled-components'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { EndGame } from '../EndGame/EndGame'
import { Button } from '@/components'
import { Temperature } from './components/Temperature'
import { Oxygen } from './components/Oxygen'

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
		<div>
			<Container>
				<div>Game State: {game && GameStateValue[game?.state]}</div>
				<div>
					Player State: {player && PlayerStateValue[player.gameState.state]}
				</div>
				<div>Generation: {game?.generation}</div>
				<div>
					Oceans: {game?.oceans} / {game?.map.oceans}
				</div>

				{game.state === GameStateValue.Ended && (
					<>
						<Button onClick={handleShow}>Show result</Button>
						{showEnd && <EndGame onClose={handleHide} />}
					</>
				)}
			</Container>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'flex-end'
				}}
			>
				<Temperature
					start={game.map.initialTemperature}
					current={game.temperature}
					target={game.map.temperature}
					milestones={game.map.temperatureMilestones}
				/>
				<Oxygen
					start={game.map.initialOxygen}
					current={game.oxygen}
					target={game.map.oxygen}
					milestones={game.map.oxygenMilestones}
				/>
			</div>
		</div>
	) : (
		<></>
	)
}

const Container = styled.div`
	background-color: rgba(14, 129, 214, 0.8);
	padding: 0.5rem;
	margin-bottom: 1rem;
`
