import background from '@/assets/mars-background.jpg'
import { useApi } from '@/context/ApiContext'
import { useAppStore } from '@/utils/hooks'
import { claimTile, placeTile } from '@shared/actions'
import { GridCell, GridCellLocation, PlayerStateValue } from '@shared/index'
import { PlayerActionType } from '@shared/player-actions'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Cell } from './components/Cell'
import { CellOverlay } from './components/CellOverlay'
import { ExpansionType } from '@shared/expansions/types'
import { VenusButton } from './components/VenusButton'

const cellPos = (x: number, y: number) => {
	if (y % 2 === 1) {
		x += 0.5
	}

	return { x: 15 + x * 18, y: 10 + y * 20 * 0.75 }
}

export const GameMap = () => {
	const api = useApi()

	const hasVenus = useAppStore((state) =>
		state.game.state?.expansions.includes(ExpansionType.Venus),
	)

	const map = useAppStore((state) => state.game.state?.map)
	const highlighted = useAppStore((state) => state.game.highlightedCell)

	const containerRef = useRef<HTMLDivElement>(null)
	const [delayFunction] = useState(0)

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

	const pending = useAppStore((state) => state.game.pendingAction)

	const isPlaying = useAppStore(
		(state) =>
			state.game.player?.state === PlayerStateValue.Playing ||
			state.game.player?.state === PlayerStateValue.EndingTiles ||
			state.game.player?.state === PlayerStateValue.Prelude ||
			state.game.player?.state === PlayerStateValue.SolarPhaseTerraform,
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
			api.send(placeTile(cell.x, cell.y, cell.location))
		} else if (claiming) {
			api.send(claimTile(cell.x, cell.y, cell.location))
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
			<Inner>
				<InnerInner>
					<Background>
						<img src={background} />
					</Background>

					{hasVenus && <VenusButton placing={placing} />}

					{map.grid.map((col) =>
						col
							.filter(
								(c) =>
									c.enabled &&
									(c.location === undefined ||
										c.location === GridCellLocation.Main),
							)
							.map((cell) => (
								<CellOverlay
									placing={placing}
									cell={cell}
									key={`${cell.x},${cell.y}`}
									pos={{
										x: (cellPos(cell.x, cell.y).x - 9) / width,
										y: (cellPos(cell.x, cell.y).y - 10) / height,
									}}
									width={18 / width}
									height={20 / height}
									highlighted={
										highlighted !== undefined &&
										highlighted.x === cell.x &&
										highlighted.y === cell.y
									}
									faded={
										highlighted !== undefined &&
										(highlighted.x !== cell.x || highlighted.y !== cell.y)
									}
								/>
							)),
					)}

					<svg
						viewBox={`0 0 ${width} ${height}`}
						style={{ overflow: 'visible' }}
					>
						<defs>
							<radialGradient id="Ocean" cx="0.5" cy="0.5" r="0.5">
								<stop offset="0%" stopColor="rgba(0,0,0,0)" />
								<stop offset="100%" stopColor="rgba(15,135,226,0.8)" />
							</radialGradient>
						</defs>

						<g>
							{map.grid.map((col) =>
								col
									.filter(
										(c) =>
											c.enabled &&
											(c.location === undefined ||
												c.location === GridCellLocation.Main),
									)
									.map((cell) => (
										<Cell
											cell={cell}
											placing={placing}
											claiming={claiming}
											delayFunction={delayFunction}
											key={`${cell.x},${cell.y}`}
											pos={cellPos(cell.x, cell.y)}
											onClick={() => handleCellClick(cell)}
											highlighted={
												highlighted !== undefined &&
												highlighted.x === cell.x &&
												highlighted.y === cell.y
											}
											faded={
												highlighted !== undefined &&
												(highlighted.x !== cell.x || highlighted.y !== cell.y)
											}
										/>
									)),
							)}
						</g>
					</svg>
				</InnerInner>
			</Inner>
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	transition: transform 0.05s;
	overflow: auto;

	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;

	max-width: 100%;
	max-height: 100%;

	display: flex;
`

const Inner = styled.div`
	width: 100%;
	position: relative;

	max-width: 800px;
	min-width: 600px;

	margin: auto auto;

	padding-top: 4rem;
	padding-left: 17rem;
	padding-right: 220px;
`

const InnerInner = styled.div`
	position: relative;

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
