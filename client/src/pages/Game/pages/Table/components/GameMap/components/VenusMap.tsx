import venusBackground from '@/assets/venus-background.png'
import { useAppStore } from '@/utils/hooks'
import { GridCell, GridCellLocation } from '@shared/index'
import { PlacementState } from '@shared/placements'
import styled from 'styled-components'
import { Cell } from './Cell'
import { CellOverlay } from './CellOverlay'

type Props = {
	onCellClick?: (cell: GridCell) => void
	placing?: PlacementState
}

const cellPos = (x: number, y: number) => {
	if (y % 2 === 1) {
		x += 0.5
	}

	return { x: 15 + x * 18, y: 10 + y * 20 * 0.75 }
}

export const VenusMap = ({ placing, onCellClick }: Props) => {
	const map = useAppStore((state) => state.game.state?.map)

	const venusMap = map.grid.map((col) =>
		col.filter((c) => c.enabled && c.location === GridCellLocation.Venus),
	)

	return (
		<WholeContainer>
			<BackgroundContainer>
				<img src={venusBackground} alt="Venus" />
			</BackgroundContainer>
			<SuperInner>
				{venusMap.map((col) =>
					col.map((cell) => (
						<CellOverlay
							placing={placing}
							cell={cell}
							key={`${cell.x},${cell.y}`}
							pos={{
								x: (cellPos(cell.x, cell.y).x - 9) / 128,
								y: (cellPos(cell.x, cell.y).y - 10) / 128,
							}}
							width={18 / 128}
							height={20 / 128}
						/>
					)),
				)}

				<svg viewBox={`0 0 ${128} ${128}`} style={{ overflow: 'visible' }}>
					<defs>
						<radialGradient id="Ocean" cx="0.5" cy="0.5" r="0.5">
							<stop offset="0%" stopColor="rgba(0,0,0,0)" />
							<stop offset="100%" stopColor="rgba(15,135,226,0.8)" />
						</radialGradient>
					</defs>

					<g>
						{venusMap.map((col) =>
							col.map((cell) => (
								<Cell
									cell={cell}
									placing={placing}
									key={`${cell.x},${cell.y}`}
									delayFunction={0}
									onClick={() => onCellClick?.(cell)}
									pos={cellPos(cell.x, cell.y)}
								/>
							)),
						)}
					</g>
				</svg>
			</SuperInner>
		</WholeContainer>
	)
}

const WholeContainer = styled.div`
	width: 512px;
	height: 512px;
	position: relative;
`

const BackgroundContainer = styled.div`
	border-radius: 50%;
	box-shadow: 0px 0px 20px 14px rgba(200, 200, 255, 0.4);
	margin: 2rem;
	position: absolute;
	inset: 0;

	> img {
		width: 100%;
		height: 100%;
	}
`

const SuperInner = styled.div`
	position: relative;
	width: 512px;
	height: 512px;

	> svg {
		position: relative;
		z-index: 1;
	}
`
