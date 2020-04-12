import React from 'react'
import styled, { css } from 'styled-components'
import { CardCallbackContext, CardEffect } from '@shared/cards'

type Props = {
	effect: CardEffect
	ctx: CardCallbackContext
	evaluate: boolean
}

export const PlayEffect = ({ effect, ctx, evaluate }: Props) => {
	return (
		<Container
			fine={!evaluate || effect.conditions.every(c => c.evaluate(ctx))}
		>
			{effect.description}
		</Container>
	)
}

const Container = styled.div<{ fine: boolean }>`
	${props =>
		!props.fine &&
		css`
			color: #f12e41;
		`}
`
