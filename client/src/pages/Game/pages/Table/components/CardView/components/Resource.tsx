import { Card } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import styled, { css } from 'styled-components'
import { CardResourceIcon } from '../../CardResourceIcon/CardResourceIcon'

type Props = {
	card: Card
	state: UsedCardState
	onCorporation?: boolean
}

export const Resource = ({ card, state, onCorporation }: Props) => {
	return card.resource ? (
		<Container
			title={`Card has ${state[card.resource]} ${card.resource} resource(s)`}
			$onCorporation={onCorporation}
		>
			<span>{state[card.resource]}</span>
			<CardResourceIcon res={card.resource} />
		</Container>
	) : (
		<></>
	)
}

const Container = styled.div<{ $onCorporation?: boolean }>`
	${({ $onCorporation }) =>
		!$onCorporation
			? css`
					margin-top: 1rem;
					margin-left: 1rem;
					padding: 0.5rem;
					float: left;
				`
			: css`
					margin-right: 0.5rem;
					padding: 0.35rem 0.5rem;
					float: right;
				`}

	background: ${({ theme }) => theme.colors.background};
	color: #fff;
	display: flex;
	align-items: center;

	> span {
		margin-right: 0.5rem;
	}
`
