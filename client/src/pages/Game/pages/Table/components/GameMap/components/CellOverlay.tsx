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
import {
	faPlus,
	faSeedling,
	faHammer,
	faStar
} from '@fortawesome/free-solid-svg-icons'
import { range } from '@/utils/collections'

type Props = {
	cell: GridCell
	pos: { x: number; y: number }
	width: number
	height: number
}

export const CellOverlay = ({ cell, pos, width, height }: Props) => {
	console.log(cell)

	return (
		<HexOverlay
			style={{
				top: `${pos.y * 100}%`,
				left: `${pos.x * 100}%`,
				width: `${width * 100}%`,
				height: `${height * 100}%`
			}}
		>
			<Resources>
				{range(0, cell.plants).map(i => (
					<FontAwesomeIcon key={i} icon={faSeedling} />
				))}
				{range(0, cell.ore).map(i => (
					<FontAwesomeIcon key={i} icon={faHammer} />
				))}
				{range(0, cell.titan).map(i => (
					<FontAwesomeIcon key={i} icon={faStar} />
				))}
			</Resources>
		</HexOverlay>
	)
}

const HexOverlay = styled.div`
	position: absolute;
	color: #99aaaa;
	display: flex;
	align-items: center;
	justify-content: center;
`

const Resources = styled.div``
