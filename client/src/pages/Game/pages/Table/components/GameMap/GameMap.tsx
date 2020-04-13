import background from '@/assets/mars-background.jpg'
import { useApi } from '@/context/ApiContext'
import { useAppStore, useWindowEvent } from '@/utils/hooks'
import { placeTile } from '@shared/actions'
import { GridCell } from '@shared/game'
import React, { useRef } from 'react'
import styled from 'styled-components'
import { Cell } from './components/Cell'
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

	const placingList = useAppStore(state => state.game.player?.placingTile)

	const placing =
		placingList && placingList.length > 0 ? placingList[0] : undefined

	const handleCellClick = (cell: GridCell) => {
		if (placing) {
			api.send(placeTile(cell.x, cell.y))
		}
	}

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

const Overlay = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
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
