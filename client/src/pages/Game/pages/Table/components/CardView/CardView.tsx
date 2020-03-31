import React, { useMemo } from 'react'
import {
	Card,
	CardType,
	CardCategory,
	CardCondition,
	CardCallbackContext
} from '@shared/cards'
import styled, { css } from 'styled-components'
import { Condition } from './components/Condition'
import { useAppStore } from '@/utils/hooks'
import { UsedCardState } from '@shared/index'
import { PlayEffect } from './components/PlayEffect'

export const CardView = ({
	card,
	selected = false,
	state,
	cardIndex,
	onClick
}: {
	card: Card
	state?: UsedCardState
	cardIndex?: number
	selected?: boolean
	onClick?: () => void
}) => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)?.gameState
	const playerId = useAppStore(state => state.game.playerId)

	const description = useMemo(() => {
		return [
			card.description,
			...(card.actionEffects.length
				? [
						`Action: [[ ${card.actionEffects
							.map(e => e.description)
							.join(' AND ')} ]]`
				  ]
				: []),
			...card.passiveEffects.map(e => e.description).filter(e => !!e),
			...(card.victoryPointsCallback
				? [card.victoryPointsCallback.description]
				: []),
			...(card.victoryPoints !== 0
				? [
						`${card.victoryPoints > 0 ? '+' : ''} ${
							card.victoryPoints
						} VICTORY POINTS`
				  ]
				: [])
		]
	}, [card])

	if (!player || !game || playerId === undefined) {
		return <></>
	}

	const condContext = useMemo(
		() =>
			({
				card: state || {
					code: card.code,
					played: false,
					animals: 0,
					fighters: 0,
					microbes: 0,
					science: 0
				},
				cardIndex,
				game,
				player,
				playerId
			} as CardCallbackContext),
		[state, card, cardIndex, game, playerId]
	)

	return (
		<Container selected={selected} onClick={onClick}>
			<Inner type={card.type}>
				<Head>
					<Cost>
						<div>{card.cost}</div>
					</Cost>
					<Categories>
						{card.categories.map(c => (
							<Category key={c}>{CardCategory[c]}</Category>
						))}
					</Categories>
				</Head>
				<Title>{card.title}</Title>
				<Description>
					{card.conditions.map((c, i) => (
						<Condition key={i} cond={c} ctx={condContext} />
					))}
					{card.playEffects.map((e, i) => (
						<PlayEffect key={i} effect={e} ctx={condContext} />
					))}
					{description.map((d, i) => (
						<div key={i}>{d}</div>
					))}
				</Description>
			</Inner>
		</Container>
	)
}

const typeToColor = {
	[CardType.Action]: '#0F87E2',
	[CardType.Building]: '#139B2F',
	[CardType.Effect]: '#0F87E2 ',
	[CardType.Event]: '#FF6868'
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
	overflow: visible;
	margin: 0 0.5rem;
	display: flex;
	position: relative;

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
	height: 2rem;

	> div {
		border-top: 2px solid rgb(221, 221, 221);
		border-left: 2px solid rgb(221, 221, 221);
		border-bottom: 2px solid rgb(137, 137, 137);
		border-right: 2px solid rgb(137, 137, 137);
		position: absolute;
		background: linear-gradient(
			rgb(255, 208, 4),
			rgb(255, 255, 104),
			rgb(255, 208, 4),
			rgb(255, 208, 4)
		);
		color: #000;
		width: 3rem;
		height: 3rem;
		line-height: 3rem;
		text-align: center;
		border-radius: 4px;
		font-size: 150%;
		float: left;
		margin-top: -0.75rem;
		margin-left: -0.75rem;
	}
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
	overflow: visible;
	min-height: 0;
	width: 100%;

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
