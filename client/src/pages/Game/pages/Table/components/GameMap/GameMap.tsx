import background from '@/assets/mars-background.jpg'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useInterval } from '@/utils/hooks'
import { claimTile, placeTile } from '@shared/actions'
import { GridCell, PlayerStateValue } from '@shared/game'
import { PlayerActionType } from '@shared/player-actions'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Cell, delayFunctions } from './components/Cell'
import { CellOverlay } from './components/CellOverlay'

type Props = {}

const cellPos = (x: number, y: number) => {
	if (y % 2 === 1) {
		x += 0.5
	}

	return { x: 15 + x * 18, y: 10 + y * 20 * 0.75 }
}

export const GameMap = ({}: Props) => {
	const api = useApi()
	const map = useAppStore(state => state.game.state?.map)
	const containerRef = useRef<HTMLDivElement>(null)
	const [delayFunction, setDelayFunction] = useState(0)

	/*
	useWindowEvent('mousemove', (e: MouseEvent) => {
		if (containerRef.current) {
			const windowRatio = window.innerHeight / window.innerWidth

			const ratio = [
				e.clientX / window.innerWidth - 0.5,
				e.clientY / window.innerHeight - 0.5
			]

			const planetOffset = 80
			const backgroundOffset = 30

			const offset = [
				-ratio[0] * planetOffset,
				-ratio[1] * planetOffset * windowRatio
			]

			const bgOffset = [
				-ratio[0] * backgroundOffset,
				-ratio[1] * backgroundOffset * windowRatio
			]

			containerRef.current.style.transform = `translate(${offset[0]}px, ${offset[1]}px)`

			const stars = document.getElementById('stars')

			if (stars) {
				stars.style.backgroundPosition = `${bgOffset[0]}px ${bgOffset[1]}px`
			}
		}
	})
	*/

	const pending = useAppStore(state => state.game.pendingAction)

	const isPlaying = useAppStore(
		state =>
			state.game.player?.state === PlayerStateValue.Playing ||
			state.game.player?.state === PlayerStateValue.EndingTiles
	)

	const placing =
		isPlaying && pending && pending.type === PlayerActionType.PlaceTile
			? pending.state
			: undefined

	const claiming = !!(
		isPlaying &&
		pending &&
		pending.type === PlayerActionType.ClaimTile
	)

	const handleCellClick = (cell: GridCell) => {
		if (placing) {
			api.send(placeTile(cell.x, cell.y))
		} else if (claiming) {
			api.send(claimTile(cell.x, cell.y))
		}
	}

	/*
	useInterval(() => {
		setDelayFunction(Math.round(Math.random() * (delayFunctions.length - 1)))
	}, 15000)
	*/

	const width = ((map?.width || 0) + 0.5) * 18
	const height = ((map?.height || 0) + 0.5) * 20 * 0.75

	return map ? (
		<Container ref={containerRef}>
			<Background>
				<img src={background} />
			</Background>

			{map.grid.map(col =>
				col
					.filter(c => c.enabled)
					.map(cell => (
						<CellOverlay
							placing={placing}
							cell={cell}
							key={`${cell.x},${cell.y}`}
							pos={{
								x: (cellPos(cell.x, cell.y).x - 9) / width,
								y: (cellPos(cell.x, cell.y).y - 10) / height
							}}
							width={18 / width}
							height={20 / height}
						/>
					))
			)}

			<svg viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
				<defs>
					<radialGradient id="Ocean" cx="0.5" cy="0.5" r="0.5">
						<stop offset="0%" stopColor="rgba(0,0,0,0)" />
						<stop offset="100%" stopColor="rgba(15,135,226,0.8)" />
					</radialGradient>
				</defs>

				<g>
					{map.grid.map(col =>
						col
							.filter(c => c.enabled)
							.map(cell => (
								<Cell
									cell={cell}
									placing={placing}
									claiming={claiming}
									delayFunction={delayFunction}
									key={`${cell.x},${cell.y}`}
									pos={cellPos(cell.x, cell.y)}
									onClick={() => handleCellClick(cell)}
								/>
							))
					)}
				</g>
			</svg>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	flex-grow: 1;
	max-width: 800px;
	margin: auto auto;
	position: relative;
	transition: transform 0.05s;

	> svg {
		position: relative;
		z-index: 1;
	}
`

const Background = styled.div`
	position: absolute;
	top: -10%;
	left: 1%;
	right: 1%;

	> img {
		margin: auto;
		width: 100%;
		border-radius: 50%;
		box-shadow: 0px 0px 20px 14px rgba(200, 200, 255, 0.4);
	}
`
