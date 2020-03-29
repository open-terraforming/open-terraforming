import React from 'react'
import { Card, CardType, CardCategory } from '@shared/cards'
import styled, { css } from 'styled-components'

export const CardView = ({
	card,
	selected = false,
	onClick
}: {
	card: Card
	selected?: boolean
	onClick?: () => void
}) => {
	return (
		<Container selected={selected} onClick={onClick}>
			<Inner type={card.type}>
				<Head>
					<Cost>{card.cost}</Cost>
					<Categories>
						{card.categories.map(c => (
							<Category key={c}>{CardCategory[c]}</Category>
						))}
					</Categories>
				</Head>
				<Title>{card.title}</Title>
				<CardImage />
				<Description>{card.description}</Description>
			</Inner>
		</Container>
	)
}

const typeToColor = {
	[CardType.Action]: '#FF6868',
	[CardType.Building]: '#139B2F',
	[CardType.Effect]: '#0F87E2',
	[CardType.Event]: '#0F87E2'
} as const

const Container = styled.div<{ selected: boolean }>`
	background: #fff;
	box-shadow: 2px 2px 10px 2px #ccc;
	padding: 0.25rem;
	border-radius: 12px;

	${props =>
		props.selected &&
		css`
			background: #9fd2f9;
		`}
`

const Head = styled.div`
	display: flex;
	align-items: center;
`

const Cost = styled.div`
	background: #e8e800;
	color: #000;
	padding: 0.5rem;
	border-radius: 12px;
`

const Categories = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
`

const Category = styled.div`
	margin-right: 0.5rem;
`

const Title = styled.div`
	padding: 0.25rem 1rem;
	text-align: center;
	color: #fff;
`

const CardImage = styled.div`
	height: 200px;
`

const Inner = styled.div<{ type: CardType }>`
	border: 4px solid ${props => typeToColor[props.type]};
	border-radius: 12px;

	${Title} {
		background: ${props => typeToColor[props.type]};
	}
`

const Description = styled.div`
	padding: 1rem;
`
