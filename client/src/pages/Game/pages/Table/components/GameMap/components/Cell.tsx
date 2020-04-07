import React from 'react'
import styled, { css } from 'styled-components'
import { GridCellType, GridCellContent, GridCell } from '@shared/index'
import { PlacementState, canPlace } from '@shared/placements'
import { useAppStore } from '@/utils/hooks'

type Props = {
	cell: GridCell
	pos: { x: number; y: number }
	placing?: PlacementState
	onClick: () => void
}

export const Cell = ({ cell, pos, placing, onClick }: Props) => {
	const game = useAppStore(state => state.game.state)

	const owner = useAppStore(state =>
		state.game.state?.players.find(p => p.id === cell.ownerId)
	)

	const player = useAppStore(state => state.game.player)
	const playerId = useAppStore(state => state.game.playerId)

	const active =
		!!placing &&
		!!game &&
		!!player &&
		playerId !== undefined &&
		cell.content === undefined &&
		(cell.claimantId === undefined || cell.claimantId === playerId) &&
		canPlace(game, player, cell, placing)

	return (
		<StyledHex
			gridType={cell.type}
			gridContent={cell.content}
			gridActive={placing ? active : undefined}
			transform={`translate(${pos.x},${pos.y})`}
			onClick={active ? onClick : undefined}
		>
			<polygon
				stroke={'rgba(255,255,255,0.3)'}
				fill="transparent"
				strokeWidth="0.5"
				points="-9,5 -9,-5 0,-10 9,-5 9,5 0,10"
			/>
			{owner && cell.content !== GridCellContent.Ocean && (
				<polygon
					stroke={owner.color}
					fill="transparent"
					strokeWidth="1"
					transform="scale(0.9)"
					points="-9,5 -9,-5 0,-10 9,-5 9,5 0,10"
				/>
			)}
			{cell.content === GridCellContent.City && (
				<path
					fill="#fff"
					d="M15 8C15 4.85 15 3.1 15 2.75C15 2.34 14.66 2 14.25 2C13.8 2 10.2 2 9.75 2C9.34 2 9 2.34 9 2.75C9 2.9 9 3.65 9 5L7 5C7 3.5 7 2.67 7 2.5C7 2.22 6.78 2 6.5 2C6.45 2 6.05 2 6 2C5.72 2 5.5 2.22 5.5 2.5C5.5 2.67 5.5 3.5 5.5 5L3.5 5C3.5 3.5 3.5 2.67 3.5 2.5C3.5 2.22 3.28 2 3 2C2.95 2 2.55 2 2.5 2C2.22 2 2 2.22 2 2.5C2 2.67 2 3.5 2 5C1.25 5 0.83 5 0.75 5C0.34 5 0 5.34 0 5.75C0 6.88 0 15.88 0 17C0 17.55 0.45 18 1 18C2.8 18 17.2 18 19 18C19.55 18 20 17.55 20 17C20 16.18 20 9.57 20 8.75C20 8.34 19.66 8 19.25 8C18.68 8 17.27 8 15 8ZM3.63 15C3.5 15 2.5 15 2.38 15C2.17 15 2 14.83 2 14.63C2 14.5 2 13.5 2 13.38C2 13.17 2.17 13 2.38 13C2.5 13 3.5 13 3.63 13C3.83 13 4 13.17 4 13.38C4 13.46 4 13.88 4 14.63C3.89 14.88 3.76 15 3.63 15ZM3.63 12C3.5 12 2.5 12 2.38 12C2.17 12 2 11.83 2 11.63C2 11.5 2 10.5 2 10.38C2 10.17 2.17 10 2.38 10C2.5 10 3.5 10 3.63 10C3.83 10 4 10.17 4 10.38C4 10.46 4 10.88 4 11.63C3.89 11.88 3.76 12 3.63 12ZM3.63 9C3.5 9 2.5 9 2.38 9C2.17 9 2 8.83 2 8.63C2 8.5 2 7.5 2 7.38C2 7.17 2.17 7 2.38 7C2.5 7 3.5 7 3.63 7C3.83 7 4 7.17 4 7.38C4 7.46 4 7.88 4 8.63C3.89 8.88 3.76 9 3.63 9ZM7.63 15C7.5 15 6.5 15 6.38 15C6.17 15 6 14.83 6 14.63C6 14.5 6 13.5 6 13.38C6 13.17 6.17 13 6.38 13C6.5 13 7.5 13 7.63 13C7.83 13 8 13.17 8 13.38C8 13.46 8 13.88 8 14.63C7.89 14.88 7.76 15 7.63 15ZM7.63 12C7.5 12 6.5 12 6.38 12C6.17 12 6 11.83 6 11.63C6 11.5 6 10.5 6 10.38C6 10.17 6.17 10 6.38 10C6.5 10 7.5 10 7.63 10C7.83 10 8 10.17 8 10.38C8 10.46 8 10.88 8 11.63C7.89 11.88 7.76 12 7.63 12ZM7.63 9C7.5 9 6.5 9 6.38 9C6.17 9 6 8.83 6 8.63C6 8.5 6 7.5 6 7.38C6 7.17 6.17 7 6.38 7C6.5 7 7.5 7 7.63 7C7.83 7 8 7.17 8 7.38C8 7.46 8 7.88 8 8.63C7.89 8.88 7.76 9 7.63 9ZM12.63 12C12.5 12 11.5 12 11.38 12C11.17 12 11 11.83 11 11.63C11 11.5 11 10.5 11 10.38C11 10.17 11.17 10 11.38 10C11.5 10 12.5 10 12.63 10C12.83 10 13 10.17 13 10.38C13 10.46 13 10.88 13 11.63C12.89 11.88 12.76 12 12.63 12ZM12.63 9C12.5 9 11.5 9 11.38 9C11.17 9 11 8.83 11 8.63C11 8.5 11 7.5 11 7.38C11 7.17 11.17 7 11.38 7C11.5 7 12.5 7 12.63 7C12.83 7 13 7.17 13 7.38C13 7.46 13 7.88 13 8.63C12.89 8.88 12.76 9 12.63 9ZM12.63 6C12.5 6 11.5 6 11.38 6C11.17 6 11 5.83 11 5.63C11 5.5 11 4.5 11 4.38C11 4.17 11.17 4 11.38 4C11.5 4 12.5 4 12.63 4C12.83 4 13 4.17 13 4.38C13 4.46 13 4.88 13 5.63C12.89 5.88 12.76 6 12.63 6ZM17.63 15C17.5 15 16.5 15 16.38 15C16.17 15 16 14.83 16 14.63C16 14.5 16 13.5 16 13.38C16 13.17 16.17 13 16.38 13C16.5 13 17.5 13 17.63 13C17.83 13 18 13.17 18 13.38C18 13.46 18 13.88 18 14.63C17.89 14.88 17.76 15 17.63 15ZM17.63 12C17.5 12 16.5 12 16.38 12C16.17 12 16 11.83 16 11.63C16 11.5 16 10.5 16 10.38C16 10.17 16.17 10 16.38 10C16.5 10 17.5 10 17.63 10C17.83 10 18 10.17 18 10.38C18 10.46 18 10.88 18 11.63C17.89 11.88 17.76 12 17.63 12Z"
					transform="translate(-4, -4) scale(0.4)"
				></path>
			)}
			{cell.content === GridCellContent.Forest && (
				<path
					fill="#0A3D11"
					d="M14.16 11.25C14.87 11.25 15.27 11.25 15.35 11.25C15.71 11.25 16.02 11.05 16.17 10.74C16.31 10.43 16.26 10.07 16.04 9.8C15.83 9.56 14.82 8.38 12.99 6.25C13.66 6.25 14.04 6.25 14.11 6.25C14.47 6.25 14.79 6.04 14.93 5.72C15.07 5.4 15 5.03 14.76 4.78C14.33 4.32 10.89 0.65 10.46 0.19C10.22 -0.06 9.78 -0.06 9.54 0.19C9.11 0.65 5.67 4.32 5.24 4.78C5 5.03 4.93 5.4 5.07 5.72C5.21 6.04 5.53 6.25 5.89 6.25C5.96 6.25 6.34 6.25 7.01 6.25C5.18 8.38 4.17 9.56 3.96 9.8C3.74 10.07 3.69 10.43 3.83 10.74C3.98 11.05 4.29 11.25 4.65 11.25C4.73 11.25 5.13 11.25 5.84 11.25C3.97 13.37 2.93 14.55 2.72 14.78C2.49 15.05 2.43 15.41 2.58 15.73C2.73 16.05 3.05 16.25 3.4 16.25C3.76 16.25 5.54 16.25 8.75 16.25L8.75 17.21C8.04 18.34 7.65 18.97 7.57 19.1C7.36 19.51 7.66 20 8.13 20C8.5 20 11.5 20 11.87 20C12.34 20 12.64 19.51 12.43 19.1C12.35 18.97 11.96 18.34 11.25 17.21L11.25 16.25C14.46 16.25 16.24 16.25 16.6 16.25C16.95 16.25 17.27 16.05 17.42 15.73C17.57 15.41 17.51 15.05 17.28 14.78C16.86 14.31 15.82 13.14 14.16 11.25Z"
					transform="translate(-4, -4) scale(0.4)"
				></path>
			)}
		</StyledHex>
	)
}

const StyledHex = styled.g<{
	gridType: GridCellType
	gridContent?: GridCellContent
	gridActive?: boolean
}>`
	polygon {
		${props =>
			props.gridType === GridCellType.Ocean &&
			!props.gridContent &&
			css`
				fill: url(#Ocean);
			`}
		${props =>
			props.gridContent === GridCellContent.Ocean &&
			css`
				fill: rgba(15, 135, 226, 0.6);
			`}

		${props =>
			props.gridContent === GridCellContent.City &&
			css`
				fill: rgba(128, 128, 128, 0.3);
			`}

		${props =>
			props.gridContent === GridCellContent.Forest &&
			css`
				fill: rgba(19, 155, 47, 0.3);
			`}

		${props =>
			props.gridContent === GridCellContent.Other &&
			css`
				fill: rgba(128, 64, 0, 0.4);
			`}

		${props =>
			props.gridActive !== undefined &&
			css`
				fill: ${props.gridActive
					? 'rgba(36,187,23,0.2)'
					: 'rgba(187,23,36,0.5)'};
				${props.gridActive ? 'cursor: pointer;' : ''}
			`}
	}
`
