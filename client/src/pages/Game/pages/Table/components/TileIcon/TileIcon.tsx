import { faCity, faTint, faTree } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GridCellContent, GridCellOther } from '@shared/index'
import React from 'react'
import styled from 'styled-components'
type Props = {
	content: GridCellContent
	other?: GridCellOther
}

const hexPoints = '-8.5,4.4 -8.5,-4.5 0,-9.5 8.5,-4.5 8.5,4.5 0,9.5'

const contentColor = {
	[GridCellContent.City]: '#818181',
	[GridCellContent.Forest]: '#0A3D11',
	[GridCellContent.Ocean]: '#446DFD',
	[GridCellContent.Other]: '#9F5C3B'
} as const

const getTileContent = (content: GridCellContent) => {
	switch (content) {
		case GridCellContent.City:
			return <FontAwesomeIcon icon={faCity} />
		case GridCellContent.Forest:
			return <FontAwesomeIcon icon={faTree} />
		case GridCellContent.Ocean:
			return <FontAwesomeIcon icon={faTint} />
	}

	return null
}

export const TileIcon = ({ content, other }: Props) => {
	return (
		<E>
			<Icon>{getTileContent(content)}</Icon>
			<Hexagon viewBox="0 0 18 20">
				<polygon
					stroke="rgba(255, 255, 255, 0.6)"
					fill={contentColor[content]}
					strokeWidth="1"
					points={hexPoints}
					transform="translate(9, 10)"
				/>
			</Hexagon>
		</E>
	)
}

const E = styled.div`
	display: inline-flex;
	position: relative;
	width: 2em;
	height: 2em;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #eee;
	z-index: 1;
`

const Icon = styled.div`
	position: relative;
	z-index: 1;
`

const Hexagon = styled.svg`
	position: absolute;
	width: 2em;
	height: 2em;
	top: 0;
	left: 0;
	z-index: 0;
`
