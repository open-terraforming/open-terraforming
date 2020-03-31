import React from 'react'
import { useAppStore } from '@/utils/hooks'
import styled, { css } from 'styled-components'
import { GridCellType, GridCellContent, GridCell } from '@shared/game'
import { Cell } from './components/Cell'
import { useApi } from '@/context/ApiContext'
import { placeTile } from '@shared/actions'

type Props = {}

const cellPos = (x: number, y: number) => {
	if (y % 2 === 1) {
		x += 0.5
	}

	return `${15 + x * 18},${10 + y * 20 * 0.75}`
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

	return map ? (
		<Container>
			<svg
				viewBox={`0 0 ${(map.width + 0.5) * 18} ${(map.height + 0.5) *
					20 *
					0.75}`}
			>
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
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
