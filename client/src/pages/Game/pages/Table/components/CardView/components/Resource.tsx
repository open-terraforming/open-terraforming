import { colors } from '@/styles'
import { Card } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import React from 'react'
import styled from 'styled-components'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'

type Props = {
	card: Card
	state: UsedCardState
}

export const Resource = ({ card, state }: Props) => {
	return card.resource ? (
		<Container
			title={`Card has ${state[card.resource]} ${card.resource} resource(s)`}
		>
			<span>{state[card.resource]}</span>
			<CardResourceIcon res={card.resource} />
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div`
	float: left;
	margin-top: 1rem;
	margin-left: 1rem;
	background: ${colors.background};
	padding: 0.5rem;
	color: #fff;
	display: flex;
	align-items: center;

	> span {
		margin-right: 0.5rem;
	}
`
