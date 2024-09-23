import styled, { css } from 'styled-components'
import { CardCallbackContext, CardEffect } from '@shared/cards'

type Props = {
	effect: CardEffect
	ctx: CardCallbackContext | undefined
	evaluate: boolean
	faded?: boolean
}

export const PlayEffect = ({ effect, ctx, evaluate, faded }: Props) => {
	return (
		<Container
			fine={
				!ctx || !evaluate || effect.conditions.every((c) => c.evaluate(ctx))
			}
			$faded={faded}
		>
			{effect.description}
		</Container>
	)
}

const Container = styled.div<{ fine: boolean; $faded?: boolean }>`
	${(props) =>
		!props.fine &&
		css`
			color: #f12e41;
		`}

	${(props) =>
		props.$faded &&
		css`
			opacity: 0.5;
		`}
`
