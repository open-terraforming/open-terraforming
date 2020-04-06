import { range } from '@/utils/collections'
import { faHammer, faSeedling, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GridCell, GridCellSpecial } from '@shared/index'
import React from 'react'
import styled from 'styled-components'
import { Card } from '@/icons/card'

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
	return !cell.content ? (
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
						<PlantRes key={i}>
							<FontAwesomeIcon icon={faSeedling} color="#356A00" />
						</PlantRes>
					))}
					{range(0, cell.ore).map(i => (
						<OreRes key={i}>
							<FontAwesomeIcon icon={faHammer} color="#8A4500" />
						</OreRes>
					))}
					{range(0, cell.titan).map(i => (
						<FontAwesomeIcon key={i} icon={faStar} color="#FFFFAC" />
					))}
					{range(0, cell.cards).map(i => (
						<Card key={i} />
					))}
				</Resources>
			)}
		</HexOverlay>
	) : (
		<></>
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

const Res = styled.div`
	padding: 0.1rem;
	margin: 0 0.1rem;
	border-radius: 0.25rem;
	border: 1px solid #fff;
`

const PlantRes = styled(Res)`
	background: #54a800;
	border-color: #356a00;
`

const OreRes = styled(Res)`
	background: #ff8811;
	border-color: #8a4500;
`
