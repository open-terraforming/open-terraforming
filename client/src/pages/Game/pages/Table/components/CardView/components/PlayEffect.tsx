import React from 'react'
import styled, { css } from 'styled-components'
import { CardCallbackContext, CardEffect } from '@shared/cards'

type Props = {
	effect: CardEffect
	ctx: CardCallbackContext
}

export const PlayEffect = ({ effect, ctx }: Props) => {
	return (
		<Container fine={effect.conditions.every(c => c.evaluate(ctx))}>
			{effect.description}
		</Container>
	)
}

const Container = styled.div<{ fine: boolean }>`
	${props =>
		!props.fine &&
		css`
			color: #e10011;
		`}
`
