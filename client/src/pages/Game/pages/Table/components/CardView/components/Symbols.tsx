import { CardSymbol } from '@shared/cards'
import styled from 'styled-components'
import { SymbolDisplay } from './SymbolDisplay'

type Props = {
	symbols: CardSymbol[]
	className?: string
}

export const Symbols = ({ symbols, className }: Props) => {
	return symbols.length > 0 ? (
		<E className={className}>
			{symbols.map((s, i) => (
				<SymbolDisplay key={i} symbol={s} />
			))}
		</E>
	) : null
}

const E = styled.div`
	display: flex;
	justify-content: center;
`
