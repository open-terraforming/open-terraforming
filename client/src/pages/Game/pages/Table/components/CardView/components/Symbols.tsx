import { CardSymbol, SymbolType } from '@shared/cards'
import React from 'react'
import styled, { css } from 'styled-components'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { TileIcon } from '../../TileIcon/TileIcon'
import { Card } from '@/icons/card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThermometerHalf } from '@fortawesome/free-solid-svg-icons'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'

type Props = {
	symbols: CardSymbol[]
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
			case SymbolType.TerraformingRating:
				return 'TR'
			case SymbolType.Oxygen:
				return 'O2'
			case SymbolType.Temperature:
				return <FontAwesomeIcon icon={faThermometerHalf} />
		}
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

export const Symbols = ({ symbols }: Props) => {
	return symbols.length > 0 ? (
		<E>
			{symbols.map((s, i) => (
				<S key={i} production={s.production} other={s.other}>
					{s.count !== undefined && (
						<Count>
							{s.count >= 0 ? '+' : '-'}
							{Math.abs(s.count) !== 1 && Math.abs(s.count)}
						</Count>
					)}{' '}
					{symbolToIcon(s)}
				</S>
			))}
		</E>
	) : null
}

const E = styled.div`
	display: flex;
	justify-content: center;
`

const S = styled.div<{ production?: boolean; other?: boolean }>`
	display: flex;
	align-items: center;
	padding: 0.3rem 0.3rem;

	${props =>
		props.other &&
		css`
			border: 0.2rem solid #b00000;
		`}
`

const Count = styled.div`
	font-weight: bold;
	margin-right: 0.2rem;
`
