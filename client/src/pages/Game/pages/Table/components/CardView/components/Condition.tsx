import React from 'react'
import styled, { css } from 'styled-components'
import { UsedCardState } from '@shared/index'
import { CardCondition, CardCallbackContext } from '@shared/cards'

type Props = {
	cond: CardCondition
	ctx: CardCallbackContext
}

export const Condition = ({ cond, ctx }: Props) => {
	return <Container fine={cond.evaluate(ctx)}>{cond.description}</Container>
}

const Container = styled.div<{ fine: boolean }>`
	${props =>
		!props.fine &&
		css`
			color: #e10011;
		`}
`
