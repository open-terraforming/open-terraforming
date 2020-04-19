import React from 'react'
import { GridCellContent, GridCellOther } from '@shared/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faTree, faTint } from '@fortawesome/free-solid-svg-icons'
type Props = {
	content: GridCellContent
	other?: GridCellOther
}

export const TileIcon = ({ content, other }: Props) => {
	switch (content) {
		case GridCellContent.City:
			return <FontAwesomeIcon icon={faCity} />
		case GridCellContent.Forest:
			return <FontAwesomeIcon icon={faTree} color="#0A3D11" />
		case GridCellContent.Ocean:
			return <FontAwesomeIcon icon={faTint} color="#46a3ff" />
	}

	return null
}
