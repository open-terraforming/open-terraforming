import { CardCallbackContext, CardCondition } from '@shared/cards'
import React from 'react'
import styled, { css } from 'styled-components'

type Props = {
	cond: CardCondition
	ctx: CardCallbackContext | undefined
	evaluate?: boolean
}

export const Condition = ({ cond, ctx, evaluate = true }: Props) => {
	return (
		<Container fine={!ctx || !evaluate || cond.evaluate(ctx)}>
			{cond.description}
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
