import { CARD_IMAGES_URL } from '@/constants'
import { useLocale } from '@/context/LocaleContext'
import { Card, CardCallbackContext, CardType } from '@shared/cards'
import { UsedCardState } from '@shared/index'
import { flatten } from '@shared/utils'
import { CSSProperties, useMemo } from 'react'
import {
	Action,
	ActionTitle,
	Categories,
	Container,
	Cost,
	Description,
	FadedSymbols,
	Head,
	HeadSymbols,
	Image,
	Played,
	Title,
	VP,
} from './CardView.styles'
import { Condition } from './components/Condition'
import { PlayEffect } from './components/PlayEffect'
import { Resource } from './components/Resource'
import { Symbols } from './components/Symbols'
import { Tag } from './components/Tag'
import { useAppStore } from '@/utils/hooks'

type Props = {
	card: Card
	state?: UsedCardState
	selected?: boolean
	onClick?: () => void
	evaluate?: boolean
	hover?: boolean
	fade?: boolean
	className?: string
	style?: CSSProperties
	wasPlayed?: boolean
	isPlayable?: boolean
	affordable?: boolean
	conditionContext?: CardCallbackContext
	calculatedVps?: number
	highlightAction?: boolean
}

export const StatelessCardView = ({
	card,
	selected = false,
	evaluate = true,
	hover = true,
	fade = true,
	className,
	state,
	onClick,
	style,
	wasPlayed,
	isPlayable,
	affordable,
	conditionContext: condContext,
	calculatedVps,
	highlightAction,
}: Props) => {
	const locale = useLocale()
	const settings = useAppStore((state) => state.settings.data)

	const played = wasPlayed
	const playable = isPlayable

	const description = useMemo(() => {
		return [
			card.description,
			...(card.victoryPointsCallback
				? [card.victoryPointsCallback.description]
				: []),
		]
	}, [card])

	const symbols = useMemo(
		() => flatten(card.playEffects.map((e) => e.symbols)),
		[card],
	)

	const playActionSymbols = useMemo(
		() => flatten(card.actionEffects.map((e) => e.symbols)),
		[card],
	)

	const passiveSymbols = useMemo(
		() => flatten(card.passiveEffects.map((e) => e.symbols)),
		[card],
	)

	const conditionSymbols = useMemo(
		() => flatten(card.conditions.map((e) => e.symbols)),
		[card],
	)

	const cardImagesUrl = settings.cardImagesUrl ?? CARD_IMAGES_URL
	const cardImageFileName = card.code.replace(/'/g, "\\'")

	const cardImageUrl =
		cardImagesUrl !== undefined
			? `${cardImagesUrl}/card/${cardImageFileName}.jpg`
			: undefined

	return (
		<Container
			type={card.type}
			selected={selected}
			onClick={onClick}
			hover={hover}
			playable={!fade || !evaluate || !!(playable && affordable)}
			played={!!played}
			style={style}
			className={
				(!evaluate || (playable && affordable) ? 'playable' : 'unplayable') +
				(className ? ` ${className}` : '')
			}
			$faded={!!highlightAction}
		>
			<Head>
				{card.type !== CardType.Corporation &&
					card.type !== CardType.Prelude && (
						<Cost affordable={!!affordable}>
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
					style={
						cardImageUrl ? { backgroundImage: `url('${cardImageUrl}')` } : {}
					}
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
					{state && <Resource card={card} state={state} onCorporation />}
					{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
					{card.victoryPointsCallback && (
						<VP
							$corporation={card.type === CardType.Corporation}
							title={card.victoryPointsCallback.description}
						>
							{calculatedVps ?? 'X'}*
						</VP>
					)}
				</>
			)}
			<Description>
				{played && <Played>Card already played this generation</Played>}

				{card.actionEffects.filter(
					(a) => a.description?.length || a.symbols.length,
				).length > 0 && (
					<Action $hasSymbols={symbols.length > 0} $highlight={highlightAction}>
						<ActionTitle $highlight={highlightAction}>Action</ActionTitle>

						<Symbols symbols={playActionSymbols} />

						{card.actionEffects.map((e, i) => (
							<PlayEffect
								key={i}
								effect={e}
								ctx={condContext}
								evaluate={evaluate}
							/>
						))}
					</Action>
				)}

				{card.passiveEffects.filter((e) => e.description).length > 0 && (
					<Action $hasSymbols={symbols.length > 0}>
						<ActionTitle $highlight={highlightAction}>Effect</ActionTitle>

						<Symbols symbols={passiveSymbols} />

						{card.passiveEffects
							.map((e) => e.description)
							.filter((e) => !!e)
							.map((e, i) => (
								<div key={i}>{e}</div>
							))}
					</Action>
				)}

				{highlightAction ? (
					<FadedSymbols symbols={symbols} />
				) : (
					<Symbols symbols={symbols} />
				)}

				{card.conditions.map((c, i) => (
					<Condition
						key={i}
						cond={c}
						ctx={condContext}
						evaluate={evaluate}
						faded={highlightAction}
					/>
				))}

				{card.playEffects.map((e, i) => (
					<PlayEffect
						key={i}
						effect={e}
						ctx={condContext}
						evaluate={evaluate}
						faded={highlightAction}
					/>
				))}
				{description.map((d, i) => (
					<div style={highlightAction ? { opacity: 0.5 } : undefined} key={i}>
						{d}
					</div>
				))}
			</Description>
		</Container>
	)
}
