import { CardCallbackContext, CardCondition } from '@shared/cards'
import styled, { css } from 'styled-components'

type Props = {
	cond: CardCondition
	ctx: CardCallbackContext | undefined
	evaluate?: boolean
	faded?: boolean
}

export const Condition = ({ cond, ctx, evaluate = true, faded }: Props) => {
	return (
		<Container fine={!ctx || !evaluate || cond.evaluate(ctx)} $faded={faded}>
			{cond.description}
		</Container>
	)
}

const Container = styled.div<{ fine: boolean; $faded?: boolean }>`
	${(props) =>
		!props.fine
			? css`
					color: #da5a67;
				`
			: css`
					color: #c1ffd4;
				`}
	${(props) =>
		props.$faded &&
		css`
			opacity: 0.5;
		`}
`
