import React from 'react'
import styled from 'styled-components'
import { Card } from '@shared/cards'
import { UsedCardState } from '@shared/index'

type Props = {
	card: Card
	state: UsedCardState
}

export const Resource = ({ card, state }: Props) => {
	return card.resource ? (
		<Container>
			{state[card.resource]} {card.resource}
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	color: #139b2f;
`
