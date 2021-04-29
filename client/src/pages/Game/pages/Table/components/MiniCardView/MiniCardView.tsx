import { useLocale } from '@/context/LocaleContext'
import { colors } from '@/styles'
import { CardsLookupApi, CardType } from '@shared/cards'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Tag } from '../CardView/components/Tag'

interface Props {
	card: string
	extended?: boolean
}

export const MiniCardView = ({ card, extended }: Props) => {
	const t = useLocale()
	const info = useMemo(() => CardsLookupApi.get(card), [card])

	return (
		<Container type={info.type} extended={!!extended}>
			<Head type={info.type}>
				{info.type !== CardType.Corporation && info.type !== CardType.Prelude && (
					<Cost>
						<div>{info.cost}</div>
					</Cost>
				)}
				<Title>{t.cards[card]}</Title>
				<Categories>
					<Categories>
						{info.categories.map((c, i) => (
							<Tag key={i} tag={c} />
						))}
					</Categories>
				</Categories>
			</Head>
			{extended && (
				<Effects>
					{info.playEffects.map((e, i) => (
						<div key={i}>{e.description}</div>
					))}
				</Effects>
			)}
		</Container>
	)
}

const Container = styled.div<{ type: CardType; extended: boolean }>`
	${props =>
		props.extended &&
		css`
			border: 0.2rem solid ${colors.cards[props.type]};
		`}
	margin: 0.5rem 0;
	width: 300px;
`

const Head = styled.div<{ type: CardType }>`
	display: flex;
	height: 2rem;
	align-items: center;
	background-color: ${props => colors.cards[props.type]};
`

const Title = styled.div`
	padding: 0 0 0 0.25rem;
	color: #fff;
	text-transform: uppercase;
`

const Cost = styled.div`
	height: 2rem;

	> div {
		background: ${colors.background};
		border: 2px solid rgb(255, 255, 104);
		color: rgb(255, 255, 104);
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		text-align: center;
		border-radius: 4px;
		font-size: 125%;
		float: left;
		margin-top: -0.1rem;
		margin-left: -0.2rem;
	}
`

const Categories = styled.div`
	display: flex;
	margin-left: auto;
`

const Effects = styled.div`
	padding: 0.5rem;
`
