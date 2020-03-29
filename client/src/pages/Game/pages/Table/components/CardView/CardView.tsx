import React, { useMemo } from 'react'
import { Card, CardType, CardCategory, CardCondition } from '@shared/cards'
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
	const description = useMemo(() => {
		const conditions = [
			...card.conditions,
			...card.playEffects.reduce(
				(acc, e) => [...acc, ...e.conditions],
				[] as CardCondition[]
			)
		]

		return [
			...(card.victoryPoints > 0
				? [`+ ${card.victoryPoints} VICTORY POINTS`]
				: []),
			card.description,
			...conditions.map(c => c.description),
			...card.playEffects.map(e => e.description)
		]
	}, [card])

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
				<Description>
					{description.map((d, i) => (
						<div key={i}>{d}</div>
					))}
				</Description>
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
	padding: 0.25rem;
	border-radius: 12px;
	color: #000;
	width: 200px;
	flex-shrink: 0;
	min-width: 0;
	min-height: 300px;
	max-height: 300px;
	overflow: auto;
	margin: 0 0.5rem;
	display: flex;

	${props =>
		props.selected &&
		css`
			box-shadow: 0px 0px 5px 5px #ffffaa;
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

const Inner = styled.div<{ type: CardType }>`
	border: 4px solid ${props => typeToColor[props.type]};
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	overflow: auto;
	min-height: 0;

	${Title} {
		background: ${props => typeToColor[props.type]};
	}
`

const Description = styled.div`
	padding: 1rem 0.5rem 0.5rem 0.5rem;
	overflow: auto;
	min-height: 0;
	flex-grow: 1;
	font-size: 85%;

	> div {
		margin-bottom: 0.25rem;
	}
`
