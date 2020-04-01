import React from 'react'
import styled, { css } from 'styled-components'
import { GridCellType, GridCellContent, GridCell } from '@shared/index'
import {
	PlacementState,
	PlacementConditionsLookup,
	canPlace
} from '@shared/placements'
import { useAppStore } from '@/utils/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

type Props = {
	cell: GridCell
	pos: { x: number; y: number }
	placing?: PlacementState
	onClick: () => void
}

export const Cell = ({ cell, pos, placing, onClick }: Props) => {
	const game = useAppStore(state => state.game.state)
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
				stroke="#fff"
				fill="transparent"
				strokeWidth="0.5"
				points="-9,5 -9,-5 0,-10 9,-5 9,5 0,10"
			/>
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
			css`
				fill: ${props.gridContent === GridCellContent.Ocean
					? 'rgba(128,128,255,0.9)'
					: 'url(#Ocean)'};
			`}
		${props =>
			props.gridContent === GridCellContent.Ocean &&
			css`
				fill: rgba(128, 128, 255, 0.9);
			`}

		${props =>
			props.gridContent === GridCellContent.City &&
			css`
				fill: rgba(128, 128, 128, 0.9);
			`}

		${props =>
			props.gridContent === GridCellContent.Forest &&
			css`
				fill: rgba(128, 255, 128, 0.9);
			`}

		${props =>
			props.gridContent === GridCellContent.Other &&
			css`
				fill: rgba(128, 64, 0, 0.9);
			`}

		${props =>
			props.gridActive !== undefined &&
			css`
				fill: ${props.gridActive
					? 'rgba(36,187,23,0.2)'
					: 'rgba(187,23,36,0.2)'};
				${props.gridActive ? 'cursor: pointer;' : ''}
			`}
	}
`