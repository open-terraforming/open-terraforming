import React from 'react'
import styled, { css } from 'styled-components'
import {
	GridCellType,
	GridCellContent,
	GridCell,
	GridCellSpecial
} from '@shared/index'
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
import { cardIcon } from '@/icons/card'

type Props = {
	cell: GridCell
	pos: { x: number; y: number }
	width: number
	height: number
}

const specialToName = {
	[GridCellSpecial.NoctisCity]: 'Noctis City',
	[GridCellSpecial.TharsisTholus]: 'Tharsis Tholus',
	[GridCellSpecial.AscraeusMons]: 'Ascraeus Mons',
	[GridCellSpecial.PavonisMons]: 'Pavonis Mons',
	[GridCellSpecial.ArsiaMons]: 'Arsia Mons',
	[GridCellSpecial.GanymedeColony]: 'Ganymede Colony',
	[GridCellSpecial.PhobosSpaceHaven]: 'Phobos Space Haven'
} as const

export const CellOverlay = ({ cell, pos, width, height }: Props) => {
	return (
		<HexOverlay
			style={{
				top: `${pos.y * 100}%`,
				left: `${pos.x * 100}%`,
				width: `${width * 100}%`,
				height: `${height * 100}%`
			}}
		>
			{cell.special !== undefined && (
				<Special>{specialToName[cell.special]}</Special>
			)}
			{cell.content === undefined && (
				<Resources>
					{range(0, cell.plants).map(i => (
						<FontAwesomeIcon key={i} icon={faSeedling} color="#54A800" />
					))}
					{range(0, cell.ore).map(i => (
						<FontAwesomeIcon key={i} icon={faHammer} color="#AA5500" />
					))}
					{range(0, cell.titan).map(i => (
						<FontAwesomeIcon key={i} icon={faStar} color="#FFFFAC" />
					))}
					{range(0, cell.cards).map(i => (
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						<FontAwesomeIcon key={i} icon={cardIcon as any} color="#0F87E2" />
					))}
				</Resources>
			)}
		</HexOverlay>
	)
}

const HexOverlay = styled.div`
	position: absolute;
	color: #99aaaa;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`

const Resources = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const Special = styled.div`
	margin-bottom: 0.5rem;
	text-align: center;
	margin-left: 0.25rem;
	margin-right: 0.25rem;
`
