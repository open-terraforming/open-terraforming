import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { Card, CardCallbackContext, CardType } from '@shared/cards'
import {
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice
} from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'
import { flatten } from '@shared/utils'
import React, { useMemo } from 'react'
import {
	Container,
	Head,
	Cost,
	HeadSymbols,
	Categories,
	Title,
	VP,
	Description,
	Played,
	Action,
	ActionTitle,
	Image
} from './CardView.styles'
import { Condition } from './components/Condition'
import { PlayEffect } from './components/PlayEffect'
import { Resource } from './components/Resource'
import { Symbols } from './components/Symbols'
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
	onClick,
	style
}: {
	card: Card
	state?: UsedCardState
	selected?: boolean
	onClick?: () => void
	buying?: boolean
	evaluate?: boolean
	hover?: boolean
	fade?: boolean
	className?: string
	style?: React.CSSProperties
}) => {
	const locale = useLocale()
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
				card: state || emptyCardState(card.code),
				game,
				player
			} as CardCallbackContext),
		[state, card, game, playerId]
	)

	const adjusted = !buying ? card.cost : minimalCardPrice(card, player)

	const affordable = !buying || adjusted <= player.money

	const calculatedVps = useMemo(
		() =>
			evaluate && !buying && card.victoryPointsCallback
				? card.victoryPointsCallback.compute({
						card: state || emptyCardState(card.code),
						player,
						game
				  })
				: undefined,
		[card, player, game]
	)

	const playable = state
		? isCardActionable(card, condContext)
		: isCardPlayable(card, condContext)

	const played = card.type === CardType.Action ? state && state.played : false

	const symbols = useMemo(() => flatten(card.playEffects.map(e => e.symbols)), [
		card
	])

	const actionSymbols = useMemo(
		() =>
			flatten(card.actionEffects.map(e => e.symbols)).concat(
				flatten(card.passiveEffects.map(e => e.symbols))
			),
		[card]
	)

	const conditionSymbols = useMemo(
		() => flatten(card.conditions.map(e => e.symbols)),
		[card]
	)

	return (
		<Container
			type={card.type}
			selected={selected}
			onClick={onClick}
			hover={hover}
			playable={!fade || !evaluate || (playable && affordable)}
			played={!!played}
			style={style}
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
				{conditionSymbols.length > 0 && (
					<HeadSymbols symbols={conditionSymbols} />
				)}
				<Categories>
					{card.categories.map((c, i) => (
						<Tag key={i} tag={c} />
					))}
				</Categories>
			</Head>
			<Title>{locale.cards[card.code]}</Title>
			{card.type !== CardType.Corporation ? (
				<Image
					style={{
						backgroundImage: `url('${
							process.env.APP_API_URL
								? `${location.protocol}//${process.env.APP_API_URL}`
								: ''
						}/card/${card.code.replace(/'/g, "\\'")}.jpg')`
					}}
				>
					{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
					{card.victoryPointsCallback && (
						<VP title={card.victoryPointsCallback.description}>
							{calculatedVps ?? 'X'}*
						</VP>
					)}

					{state && <Resource card={card} state={state} />}
				</Image>
			) : (
				<>
					{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
					{card.victoryPointsCallback && (
						<VP title={card.victoryPointsCallback.description}>
							{calculatedVps ?? 'X'}*
						</VP>
					)}
				</>
			)}
			<Description>
				{played && <Played>Card already played this generation</Played>}
				{(card.actionEffects.length > 0 ||
					card.passiveEffects.filter(e => e.description).length > 0) && (
					<Action>
						<ActionTitle>
							{card.type === CardType.Action ? 'Action' : 'Effect'}
						</ActionTitle>

						<Symbols symbols={actionSymbols} />

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

				<Symbols symbols={symbols} />

				{card.conditions.map((c, i) => (
					<Condition key={i} cond={c} ctx={condContext} evaluate={evaluate} />
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
			</Description>
		</Container>
	)
}
