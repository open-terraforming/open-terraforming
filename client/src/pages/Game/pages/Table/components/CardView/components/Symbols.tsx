import { CardSymbol } from '@shared/cards'
import styled from 'styled-components'
import { SymbolDisplay } from './SymbolDisplay'

type Props = {
	symbols: CardSymbol[]
	noVerticalSpacing?: boolean
	noSpacing?: boolean
	className?: string
}

export const Symbols = ({
	symbols,
	noVerticalSpacing,
	noSpacing,
	className,
}: Props) => {
	return symbols.length > 0 ? (
		<E className={className}>
			{symbols.map((s, i) => (
				<SymbolDisplay
					key={i}
					symbol={s}
					noVerticalSpacing={noVerticalSpacing}
					noSpacing={noSpacing}
				/>
			))}
		</E>
	) : null
}

const E = styled.div`
	display: flex;
	justify-content: center;
`
