import { GridCellContent, GridCellOther } from './game'

export const tileWithArticle = (content: GridCellContent) => {
	return `${tileArticle(content)} ${tileToStr(content)}`
}

export const tileArticle = (content: GridCellContent) => {
	switch (content) {
		case GridCellContent.City:
		case GridCellContent.Forest:
			return 'a'
		case GridCellContent.Ocean:
		case GridCellContent.Other:
			return 'an'
	}
}

export const tileToStr = (content: GridCellContent) => {
	switch (content) {
		case GridCellContent.City:
			return 'City'
		case GridCellContent.Forest:
			return 'Greenery'
		case GridCellContent.Ocean:
			return 'Ocean'
		case GridCellContent.Other:
			return 'Other'
	}
}

export const otherWithArticle = (other: GridCellOther) => {
	return `${otherArticle(other)} ${otherToStr(other)}`
}

export const otherArticle = (other: GridCellOther) => {
	switch (other) {
		case GridCellOther.Capital:
		case GridCellOther.CommercialDistrict:
		case GridCellOther.NaturalPreserve:
		case GridCellOther.Mine:
		case GridCellOther.Mohole:
		case GridCellOther.RestrictedZone:
		case GridCellOther.Volcano:
		case GridCellOther.NuclearZone:
			return 'a'
		case GridCellOther.IndustrialCenter:
		case GridCellOther.EcologicalZone:
			return 'an'
	}
}

export const otherToStr = (other: GridCellOther) => {
	switch (other) {
		case GridCellOther.Capital:
			return 'Capital'
		case GridCellOther.CommercialDistrict:
			return 'Commercial District'
		case GridCellOther.EcologicalZone:
			return 'Ecological Zone'
		case GridCellOther.IndustrialCenter:
			return 'Industrial Center'
		case GridCellOther.NaturalPreserve:
			return 'Natural Preserve'
		case GridCellOther.Mine:
			return 'Mine'
		case GridCellOther.Mohole:
			return 'Mohole'
		case GridCellOther.NuclearZone:
			return 'Nuclear Zone'
		case GridCellOther.RestrictedZone:
			return 'Restricted Zone'
		case GridCellOther.Volcano:
			return 'Volcano'
	}
}
