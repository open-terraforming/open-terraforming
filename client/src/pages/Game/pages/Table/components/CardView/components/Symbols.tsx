import { Card } from '@/icons/card'
import { venusIcon } from '@/icons/venus'
import {
	faArrowRight,
	faThermometerHalf,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardSymbol, SymbolType } from '@shared/cards'
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
				return <MinusSymbol />
			case SymbolType.Plus:
				return <TextSymbol>+</TextSymbol>
			case SymbolType.Slash:
				return <SlashSymbol />
			case SymbolType.SlashSmall:
				return <TextSymbol>/</TextSymbol>
			case SymbolType.Colon:
				return <TextSymbol>:</TextSymbol>
			case SymbolType.Equal:
				return <TextSymbol>=</TextSymbol>
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
				return <TextSymbol>{'\u2265'}</TextSymbol>
			case SymbolType.LessOrEqual:
				return <TextSymbol>{'\u2264'}</TextSymbol>
			case SymbolType.Venus:
				return <FontAwesomeIcon icon={venusIcon} />
			case SymbolType.AnyResource:
				return <ResourceContainer>?</ResourceContainer>
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
						: Math.abs(s.count) !== 1
							? Math.abs(s.count).toString()
							: ''

				const countSymbol =
					s.count === undefined ? undefined : s.count < 0 ? (
						countStr ? (
							'-'
						) : (
							<MinusSymbol />
						)
					) : s.symbol === SymbolType.Oxygen ||
					  s.symbol === SymbolType.Temperature ? (
						<BigPlus>+</BigPlus>
					) : undefined

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
							s.symbol === SymbolType.Minus ||
							s.symbol === SymbolType.SlashSmall ||
							s.symbol === SymbolType.Slash
						}
					>
						{((countStr && countStr.length > 0) || countSymbol) && (
							<Count>
								{countSymbol}
								{countStr}
							</Count>
						)}
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
	${(props) =>
		!props.noSpacing &&
		css`
			padding: 0.3rem 0.3rem;
		`}

	${(props) =>
		props.other &&
		css`
			// border: 0.2rem solid #ff5555;
			box-shadow: inset 0 0 0 0.2rem #ff5555;
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
	display: flex;
	align-items: center;
	justify-content: center;
`

const ResourceContainer = styled.div`
	background-color: #fff;
	border-radius: 0.1rem;
	width: 1.1rem;
	height: 1.1rem;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #000;
`

const TextSymbol = styled.div`
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
`

const MinusSymbol = styled.div`
	background-color: ${({ theme }) => theme.colors.text};
	height: 3px;
	width: 8px;
`

const SlashSymbol = styled.div`
	background-color: ${({ theme }) => theme.colors.text};
	height: 4px;
	width: 20px;
	transform: rotate(-60deg);
	border-radius: 2px;
`

const BigPlus = styled.div`
	font-size: 150%;
	font-weight: bold;
`
