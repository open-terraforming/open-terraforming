import { Card } from '@/icons/card'
import { venusIcon } from '@/icons/venus'
import {
	faArrowRight,
	faThermometerHalf,
	faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CardSymbol, SymbolType } from '@shared/cards'
import { css, styled } from 'styled-components'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'
import { ResourceIcon } from '../../ResourceIcon/ResourceIcon'
import { TileIcon } from '../../TileIcon/TileIcon'
import { CardWithNoTagSymbol } from './CardWithNoTagSymbol'
import { ColonyBuildSymbol } from './ColonyBuildSymbol'
import { ColonyFleetSymbol } from './ColonyFleetSymbol'
import { ColonyTradeSymbol } from './ColonyTradeSymbol'
import { Tag } from './Tag'

type Props = {
	symbol: CardSymbol
	className?: string
	noSpacing?: boolean
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
			case SymbolType.BigPlus:
				return <BigPlus>+</BigPlus>
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
			case SymbolType.Colony:
				return <ColonyBuildSymbol />
			case SymbolType.ColonyTrade:
				return <ColonyTradeSymbol />
			case SymbolType.TradeFleet:
				return <ColonyFleetSymbol />
			// TODO: Implement
			case SymbolType.CardWithNoTag:
				return <CardWithNoTagSymbol />
			case SymbolType.Player:
				return <FontAwesomeIcon icon={faUser} />
			default:
				console.warn('Unknown symbol', SymbolType[s.symbol])
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

const getCountSymbol = (symbol: CardSymbol, countStr: string | undefined) => {
	const { count, symbol: symbolType, forceSign } = symbol

	if (count === undefined) {
		return undefined
	}

	if (count < 0) {
		if (countStr) {
			return '-'
		}

		return <MinusSymbol />
	}

	if (
		symbolType === SymbolType.Oxygen ||
		symbolType === SymbolType.Temperature
	) {
		return <BigPlus>+</BigPlus>
	}

	if (forceSign) {
		return <BigPlus>+</BigPlus>
	}

	return undefined
}

export const SymbolDisplay = ({ symbol: s, className, noSpacing }: Props) => {
	const countStr =
		s.count === undefined
			? undefined
			: Math.abs(s.count) !== 1 || s.forceCount
				? Math.abs(s.count).toString()
				: ''

	const countSymbol = getCountSymbol(s, countStr)

	return (
		<S
			className={className}
			production={s.production}
			other={s.other}
			style={{ color: s.color, ...(s.noRightSpacing && { paddingRight: 0 }) }}
			title={s.title}
			noSpacing={
				noSpacing ||
				s.symbol === SymbolType.X ||
				s.symbol === SymbolType.RightArrow ||
				s.symbol === SymbolType.LessOrEqual ||
				s.symbol === SymbolType.MoreOrEqual ||
				s.symbol === SymbolType.Plus ||
				s.symbol === SymbolType.Colon ||
				s.symbol === SymbolType.Minus ||
				s.symbol === SymbolType.SlashSmall ||
				s.symbol === SymbolType.Slash ||
				s.symbol === SymbolType.BigPlus ||
				s.symbol === SymbolType.Player
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
}

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
			padding: 0.3em 0.3em;
		`}

	${(props) =>
		props.other &&
		css`
			filter: drop-shadow(-2px 0px 2px #c93939) drop-shadow(2px 0px 2px #c93939)
				drop-shadow(0px -2px 2px #c93939) drop-shadow(0px 2px 2px #c93939);
		`}
`

const XSymbol = styled.div`
	padding-left: 0.3em;
	margin-right: -0.25em;
`

const Count = styled.div`
	font-weight: bold;
	margin-right: 0.2em;
	display: flex;
	align-items: center;
	justify-content: center;
`

const ResourceContainer = styled.div`
	background-color: #fff;
	border-radius: 0.1em;
	width: 1.1em;
	height: 1.1em;
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
