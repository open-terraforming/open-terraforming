import mars from '@/assets/mars-icon.png'
import { colors } from '@/styles'
import { useAppStore } from '@/utils/hooks'
import { Card, CardCallbackContext, CardType } from '@shared/cards'
import {
	isCardActionable,
	isCardPlayable,
	minimalCardPrice,
	emptyCardState
} from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { Condition } from './components/Condition'
import { PlayEffect } from './components/PlayEffect'
import { Resource } from './components/Resource'
import { Tag } from './components/Tag'

export const CardView = ({
	card,
	selected = false,
	buying = false,
	evaluate = true,
	hover = true,
	fade = true,
	className,
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
	evaluate?: boolean
	hover?: boolean
	fade?: boolean
	className?: string
}) => {
	const game = useAppStore(state => state.game.state)
	const player = useAppStore(state => state.game.player)
	const playerId = useAppStore(state => state.game.playerId)

	const description = useMemo(() => {
		return [
			card.description,
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

	const adjusted = !buying ? card.cost : minimalCardPrice(card, player)

	const affordable = !buying || adjusted <= player.money

	const calculatedVps = useMemo(
		() =>
			evaluate && !buying && card.victoryPointsCallback
				? card.victoryPointsCallback.compute({
						card: state || emptyCardState(card.code),
						cardIndex: cardIndex ?? -1,
						player,
						playerId: player.id,
						game
				  })
				: undefined,
		[card, player, game]
	)

	const playable = state
		? isCardActionable(card, condContext)
		: isCardPlayable(card, condContext)

	const played = card.type === CardType.Action ? state && state.played : false

	return (
		<Container
			type={card.type}
			selected={selected}
			onClick={onClick}
			hover={hover}
			playable={!fade || !evaluate || (playable && affordable)}
			played={!!played}
			className={
				(!evaluate || (playable && affordable) ? 'playable' : 'unplayable') +
				(className ? ` ${className}` : '')
			}
		>
			<Head>
				{card.type !== CardType.Corporation && card.type !== CardType.Prelude && (
					<Cost affordable={affordable}>
						<div>{card.cost}</div>
					</Cost>
				)}
				<Categories>
					{card.categories.map((c, i) => (
						<Tag key={i} tag={c} />
					))}
				</Categories>
			</Head>
			<Title>{card.title}</Title>
			{card.type !== CardType.Corporation && (
				<Image
					style={{
						backgroundImage: `url('${
							process.env.APP_API_URL ? `http://${process.env.APP_API_URL}` : ''
						}/card/${card.code.replace(/'/g, "\\'")}')`
					}}
				/>
			)}
			<Description>
				<VPC>
					{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
					{card.victoryPointsCallback && (
						<VP title={card.victoryPointsCallback.description}>
							{calculatedVps ?? 'X'}*
						</VP>
					)}
				</VPC>

				{played && <Played>Card already played this generation</Played>}
				{(card.actionEffects.length > 0 || card.passiveEffects.length > 0) && (
					<Action>
						<ActionTitle>
							{card.type === CardType.Action ? 'Action' : 'Effect'}
						</ActionTitle>
						{card.actionEffects.map((e, i) => (
							<PlayEffect
								key={i}
								effect={e}
								ctx={condContext}
								evaluate={evaluate}
							/>
						))}
						{card.passiveEffects
							.map(e => e.description)
							.filter(e => !!e)
							.map((e, i) => (
								<div key={i}>{e}</div>
							))}
					</Action>
				)}
				{card.conditions.map((c, i) => (
					<Condition key={i} cond={c} ctx={condContext} />
				))}
				{card.playEffects.map((e, i) => (
					<PlayEffect
						key={i}
						effect={e}
						ctx={condContext}
						evaluate={evaluate}
					/>
				))}
				{description.map((d, i) => (
					<div key={i}>{d}</div>
				))}
				{state && <Resource card={card} state={state} />}
			</Description>
		</Container>
	)
}

const typeToColor = {
	[CardType.Action]: '#0F87E2',
	[CardType.Building]: '#56BA1B',
	[CardType.Effect]: '#0F87E2 ',
	[CardType.Event]: '#FF6868',
	[CardType.Corporation]: '#BAC404',
	[CardType.Prelude]: '#FF86C2'
} as const

const Head = styled.div`
	display: flex;
	align-items: center;
	height: 2rem;
`

const Action = styled.div`
	background: ${colors.background};
	padding: 0.5rem;
	border: 0.1rem solid ${colors.border};
	&& {
		margin-bottom: 1rem;
	}
`

const ActionTitle = styled.div`
	margin-left: auto;
	margin-right: auto;
	width: 5rem;
	margin-top: -1rem;
	background: ${colors.background};
	border: 0.1rem solid ${colors.border};
	text-align: center;
	padding: 0.1rem 0;
	margin-bottom: 0.2rem;
`

const Cost = styled.div<{ affordable: boolean }>`
	height: 2rem;

	> div {
		background: ${colors.background};

		position: absolute;

		${props =>
			props.affordable
				? css`
						border: 2px solid rgb(255, 255, 104);
						color: rgb(255, 255, 104);
				  `
				: css`
						border: 2px solid rgba(255, 135, 135, 1);
						color: rgba(255, 135, 135, 1);
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
	padding: 0.5rem 0.5rem;
	text-align: center;
	color: #f0f0f0;
	text-transform: uppercase;
	font-size: 100%;
`

const Description = styled.div`
	padding: 1rem 0.5rem 0.5rem 0.5rem;
	overflow: auto;
	min-height: 0;
	flex-grow: 1;
	font-size: 85%;
	text-align: center;

	> div {
		margin-bottom: 0.25rem;
	}
`

const Played = styled.div`
	color: #f12e41;
`

const VPC = styled.div`
	&:before {
		content: '';
		display: block;
		float: right;
		height: 90px;
	}
`

const VP = styled.div`
	clear: both;
	float: right;
	margin-right: 0.1rem;
	margin-top: 0.5rem;

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

const Image = styled.div`
	height: 30%;
	background-position: center center;
	background-size: 100% auto;
	background-repeat: no-repeat;
	opacity: 0.5;
`

type ContainerCtx = {
	selected: boolean
	playable: boolean
	played: boolean
	hover: boolean
	type: CardType
}

const Container = styled.div<ContainerCtx>`
	border: 0.2rem solid ${props => typeToColor[props.type]};
	background: ${colors.background};
	width: ${props => (props.type === CardType.Corporation ? '400px' : '240px')};
	flex-shrink: 0;
	min-width: 0;
	height: 350px;
	max-height: 350px;
	overflow: visible;
	margin: 0 0.5rem;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: visible;

	${Title} {
		background: ${props => typeToColor[props.type]};
	}


	${props =>
		props.type === CardType.Corporation &&
		css`
			width: 300px;
			height: 200px;
			max-height: 200px;
			display: block;

			${Title} {
				float: left;
			}

			${Head} {
				float: right;
			}

			${Description} {
				clear: both;
			}
		`}

	${props =>
		!props.playable
			? css`
					opacity: 0.6;
			  `
			: props.hover &&
			  css`
					cursor: pointer;
					transition: transform 0.1s;

					&:hover {
						/*box-shadow: 0px 0px 3px 3px ${colors.border};*/
						transform: scale(1.07);
					}
			  `}

	${props =>
		props.selected &&
		css`
			box-shadow: 0px 0px 5px 5px #ffffaa;
		`}

	${props =>
		props.played &&
		css`
			transform: rotate(1deg);
		`}
`
