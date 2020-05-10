import { Button } from '@/components'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import { faPoll } from '@fortawesome/free-solid-svg-icons'
import { GameStateValue } from '@shared/index'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { EndGame } from '../EndGame/EndGame'
import { Oceans } from './components/Oceans'
import { Oxygen } from './components/Oxygen'
import { Temperature } from './components/Temperature'

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
		<E>
			<div>
				<Container>
					<div>Generation</div>

					<Generation>{game?.generation}</Generation>
				</Container>

				{game.state === GameStateValue.Ended && (
					<Results>
						<Button onClick={handleShow} icon={faPoll}>
							Results
						</Button>
						{showEnd && <EndGame onClose={handleHide} />}
					</Results>
				)}

				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'stretch'
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

				<Oceans current={game.oceans} target={game.map.oceans} />
			</div>
		</E>
	) : (
		<></>
	)
}

const E = styled.div`
	width: 208px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	overflow-y: auto;
	overflow-x: hidden;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 2;
`

const Container = styled.div`
	background-color: ${colors.background};
	border: 2px solid ${colors.border};
	padding: 0.25rem 0.5rem;
	margin-bottom: 1rem;
	margin-right: 2rem;
	margin-top: 1rem;
	text-align: center;
	line-height: 150%;
`

const Generation = styled.div`
	font-size: 150%;
`

const Results = styled.div`
	margin-bottom: 1rem;
	margin-right: 2rem;

	> button {
		width: 100%;
	}
`
