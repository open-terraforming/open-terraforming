import { Card } from '@/icons/card'
import {
	faArrowRight,
	faThermometerHalf
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardSymbol, SymbolType } from '@shared/cards'
import React from 'react'
import styled, { css } from 'styled-components'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { TileIcon } from '../../TileIcon/TileIcon'
import { Tag } from './Tag'

type Props = {
	symbols: CardSymbol[]
	className?: string
}

const symbolToIcon = (s: CardSymbol) => {
	if (s.symbol) {
		switch (s.symbol) {
			case SymbolType.Card:
				return <Card />
			case SymbolType.Minus:
				return '-'
			case SymbolType.Plus:
				return '+'
			case SymbolType.Slash:
				return '/'
			case SymbolType.Colon:
				return ':'
			case SymbolType.X:
				return <XSymbol>X</XSymbol>
			case SymbolType.RightArrow:
				return <FontAwesomeIcon icon={faArrowRight} />
			case SymbolType.TerraformingRating:
				return 'TR'
			case SymbolType.Oxygen:
				return 'O2'
			case SymbolType.Temperature:
				return <FontAwesomeIcon icon={faThermometerHalf} />
			case SymbolType.MoreOrEqual:
				return '\u2265'
			case SymbolType.LessOrEqual:
				return '\u2264'
		}
	}

	if (s.text) {
		return s.text
	}

	if (s.tag) {
		return <Tag tag={s.tag} size="sm" />
	}

	if (s.cardResource) {
		return <CardResourceIcon res={s.cardResource} />
	}

	if (s.resource) {
		return <ResourceIcon res={s.resource} production={s.production} />
	}

	if (s.tile) {
		return <TileIcon content={s.tile} other={s.tileOther} />
	}

	return null
}

export const Symbols = ({ symbols, className }: Props) => {
	return symbols.length > 0 ? (
		<E className={className}>
			{symbols.map((s, i) => {
				const countStr =
					s.count === undefined
						? undefined
						: (s.count < 0
								? '-'
								: s.symbol === SymbolType.Oxygen ||
								  s.symbol === SymbolType.Temperature
								? '+'
								: '') + (Math.abs(s.count) !== 1 ? Math.abs(s.count) : '')

				return (
					<S
						key={i}
						production={s.production}
						other={s.other}
						noSpacing={
							s.symbol === SymbolType.X ||
							s.symbol === SymbolType.RightArrow ||
							s.symbol === SymbolType.LessOrEqual ||
							s.symbol === SymbolType.MoreOrEqual ||
							s.symbol === SymbolType.Plus ||
							s.symbol === SymbolType.Colon ||
							s.symbol === SymbolType.Minus
						}
					>
						{countStr && countStr.length > 0 && <Count>{countStr}</Count>}
						{symbolToIcon(s)}
					</S>
				)
			})}
		</E>
	) : null
}

const E = styled.div`
	display: flex;
	justify-content: center;
`

const S = styled.div<{
	production?: boolean
	other?: boolean
	noSpacing?: boolean
}>`
	display: flex;
	align-items: center;
	${props =>
		!props.noSpacing &&
		css`
			padding: 0.3rem 0.3rem;
		`}

	${props =>
		props.other &&
		css`
			border: 0.1rem solid #ff5555;
			margin: 0.2rem;
		`}
`

const XSymbol = styled.div`
	padding-left: 0.3rem;
	margin-right: -0.25rem;
`

const Count = styled.div`
	font-weight: bold;
	margin-right: 0.2rem;
`
