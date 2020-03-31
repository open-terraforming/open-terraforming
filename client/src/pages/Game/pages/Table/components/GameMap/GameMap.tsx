import React from 'react'
import { useAppStore } from '@/utils/hooks'
import styled, { css } from 'styled-components'
import { GridCellType, GridCellContent, GridCell } from '@shared/game'
import { Cell } from './components/Cell'
import { useApi } from '@/context/ApiContext'
import { placeTile } from '@shared/actions'
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

	const placingList = useAppStore(
		state => state.game.player?.gameState.placingTile
	)

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
		<Container>
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

			<svg viewBox={`0 0 ${width} ${height}`}>
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
