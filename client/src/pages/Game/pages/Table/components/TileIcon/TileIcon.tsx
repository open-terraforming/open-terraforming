import { faCity, faTint, faTree } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GridCellContent, GridCellOther } from '@shared/index'
import styled from 'styled-components'
import { OtherIcons } from '../GameMap/icons/other'
type Props = {
	content?: GridCellContent
	other?: GridCellOther
	size?: string
}

const hexPoints = '-8.5,4.4 -8.5,-4.5 0,-9.5 8.5,-4.5 8.5,4.5 0,9.5'

const contentColor = {
	[GridCellContent.City]: '#818181',
	[GridCellContent.Forest]: '#0A3D11',
	[GridCellContent.Ocean]: '#446DFD',
	[GridCellContent.Other]: '#9F5C3B',
} as const

const getTileContent = (content: GridCellContent, other?: GridCellOther) => {
	if (other) {
		return (
			<OtherIcon viewBox="0 0 18 20">
				<path fill="#CC9479" d={OtherIcons[other]} />
			</OtherIcon>
		)
	}

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

export const TileIcon = ({ content, other, size }: Props) => {
	return (
		<E style={size ? { width: size, height: size } : undefined}>
			{content && <Icon>{getTileContent(content, other)}</Icon>}
			<Hexagon
				viewBox="0 0 18 20"
				style={size ? { width: size, height: size } : undefined}
			>
				<polygon
					stroke="rgba(255, 255, 255, 0.6)"
					fill={content ? contentColor[content] : '#ccc'}
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

const OtherIcon = styled.svg`
	width: 1.2em;
	height: 1.2em;
	z-index: 0;
`
