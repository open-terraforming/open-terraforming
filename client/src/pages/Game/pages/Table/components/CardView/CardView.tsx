import { useAppStore } from '@/utils/hooks'
import {
	Card,
	CardCallbackContext,
	CardCategory,
	CardType
} from '@shared/cards'
import { isCardActionable, isCardPlayable } from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Condition } from './components/Condition'
import { PlayEffect } from './components/PlayEffect'
import { Resource } from './components/Resource'
import { Tag } from './components/Tag'
import mars from '@/assets/mars-icon.png'

export const CardView = ({
	card,
	selected = false,
	buying = false,
	state,
	cardIndex,
	onClick
}: {
	card: Card
	state?: UsedCardState
	cardIndex?: number
	selected?: boolean
	onClick?: () => void
	buying?: boolean
}) => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)?.gameState
	const playerId = useAppStore(state => state.game.playerId)

	const description = useMemo(() => {
		return [
			card.description,
			...card.passiveEffects.map(e => e.description).filter(e => !!e),
			...(card.victoryPointsCallback
				? [card.victoryPointsCallback.description]
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

	const adjusted = !buying
		? card.cost
		: card.cost -
		  (card.categories.includes(CardCategory.Building)
				? player.ore * player.orePrice
				: 0) -
		  (card.categories.includes(CardCategory.Space)
				? player.titan * player.titanPrice
				: 0)

	const affordable = !buying || adjusted <= player.money

	const playable = state
		? isCardActionable(card, condContext)
		: isCardPlayable(card, condContext)

	return (
		<Container
			selected={selected}
			onClick={onClick}
			playable={playable && affordable}
		>
			<Inner type={card.type}>
				<Head>
					<Cost affordable={affordable}>
						<div>{card.cost}</div>
					</Cost>
					<Categories>
						{card.categories.map((c, i) => (
							<Tag key={i} tag={c} />
						))}
					</Categories>
				</Head>
				<Title>{card.title}</Title>
				<Description>
					{state && state.played && (
						<Played>Card already played this generation</Played>
					)}
					{card.actionEffects.length > 0 && (
						<Action>
							<ActionTitle>Action</ActionTitle>
							{card.actionEffects.map((e, i) => (
								<PlayEffect key={i} effect={e} ctx={condContext} />
							))}
						</Action>
					)}
					{card.conditions.map((c, i) => (
						<Condition key={i} cond={c} ctx={condContext} />
					))}
					{card.playEffects.map((e, i) => (
						<PlayEffect key={i} effect={e} ctx={condContext} />
					))}
					{description.map((d, i) => (
						<div key={i}>{d}</div>
					))}
					{state && <Resource card={card} state={state} />}
					{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
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

const Container = styled.div<{ selected: boolean; playable: boolean }>`
	background: ${props => (props.playable ? '#fff' : '#eee')};
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

const Action = styled.div`
	background: #eee;
	padding: 0.5rem;
	border-bottom: 2px solid rgb(221, 221, 221);
	border-right: 2px solid rgb(221, 221, 221);
	border-top: 2px solid rgb(137, 137, 137);
	border-left: 2px solid rgb(137, 137, 137);
	&& {
		margin-bottom: 1rem;
	}
`

const ActionTitle = styled.div`
	margin-left: auto;
	margin-right: auto;
	width: 5rem;
	margin-top: -1rem;
	background: #fff;
	border-top: 2px solid rgb(221, 221, 221);
	border-left: 2px solid rgb(221, 221, 221);
	border-bottom: 2px solid rgb(137, 137, 137);
	border-right: 2px solid rgb(137, 137, 137);
	text-align: center;
`

const Cost = styled.div<{ affordable: boolean }>`
	height: 2rem;

	> div {
		border-top: 2px solid rgb(221, 221, 221);
		border-left: 2px solid rgb(221, 221, 221);
		border-bottom: 2px solid rgb(137, 137, 137);
		border-right: 2px solid rgb(137, 137, 137);
		position: absolute;
		${props =>
			props.affordable
				? css`
						background: linear-gradient(
							rgb(255, 208, 4),
							rgb(255, 255, 104),
							rgb(255, 208, 4),
							rgb(255, 208, 4)
						);
						color: #000;
				  `
				: css`
						background: linear-gradient(
							to bottom,
							rgba(255, 135, 135, 1) 0%,
							rgba(255, 201, 201, 1) 33%,
							rgba(255, 134, 134, 1) 66%,
							rgba(255, 137, 135, 1) 100%
						);
						color: #000;
				  `}
		width: 2.5rem;
		height: 2.5rem;
		line-height: 2.5rem;
		text-align: center;
		border-radius: 4px;
		font-size: 150%;
		float: left;
		margin-top: -0.5rem;
		margin-left: -0.5rem;
	}
`

const Categories = styled.div`
	margin-left: auto;
	display: flex;
	align-items: center;
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

const Played = styled.div`
	color: #e10011;
`

const VP = styled.div`
	position: absolute;
	bottom: 10px;
	right: 10px;
	border-radius: 50%;
	width: 3rem;
	height: 3rem;
	line-height: 3rem;
	text-align: center;
	font-size: 200%;
	color: #fff;

	border-top: 2px solid rgb(221, 221, 221);
	border-left: 2px solid rgb(221, 221, 221);
	border-bottom: 2px solid rgb(137, 137, 137);
	border-right: 2px solid rgb(137, 137, 137);

	background-image: url('${mars}');
	background-size: 100% 100%;
`
