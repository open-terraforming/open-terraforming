import React from 'react'
import { useAppStore } from '@/utils/hooks'
import styled, { css } from 'styled-components'
import { GridFieldType, GridFieldContent } from '@shared/game'

type Props = {}

const cellPos = (x: number, y: number) => {
	if (y % 2 === 1) {
		x += 0.5
	}

	return `${15 + x * 18},${10 + y * 20 * 0.75}`
}

export const GameMap = ({}: Props) => {
	const map = useAppStore(state => state.game.state?.map)

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
								<StyledHex
									gridType={cell.type}
									gridContent={cell.content}
									key={`${cell.x},${cell.y}`}
									transform={`translate(${cellPos(cell.x, cell.y)})`}
								>
									<polygon
										stroke="#fff"
										fill="transparent"
										strokeWidth="0.5"
										points="-9,5 -9,-5 0,-10 9,-5 9,5 0,10"
									/>
								</StyledHex>
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

const StyledHex = styled.g<{
	gridType: GridFieldType
	gridContent?: GridFieldContent
}>`
	polygon {
		${props =>
			props.gridType === GridFieldType.Ocean &&
			css`
				fill: ${props.gridContent === GridFieldContent.Ocean
					? 'rgba(128,128,255,0.9)'
					: 'url(#Ocean)'};
			`}
	}
`
