import { CARD_IMAGES_URL } from '@/constants'
import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import { Card, CardCallbackContext, CardType } from '@shared/cards'
import { PlayerState, UsedCardState } from '@shared/index'
import { flatten } from '@shared/utils'
import { CSSProperties, ReactNode, useMemo } from 'react'
import {
	Action,
	ActionTitle,
	AdjustedCost,
	Categories,
	Container,
	CorporationTitle,
	Cost,
	Description,
	FadedSymbols,
	Head,
	HeadSymbols,
	Image,
	OriginalCost,
	Played,
	Title,
	VP,
} from './CardView.styles'
import { Condition } from './components/Condition'
import { PlayEffect } from './components/PlayEffect'
import { Resource } from './components/Resource'
import { Symbols } from './components/Symbols'
import { Tag } from './components/Tag'
import { Tooltip } from '@/components'
import { CardHints } from './components/CardHints'

type Props = {
	card: Card
	state?: UsedCardState
	adjustedPrice?: number
	adjustedPriceContext?: ReactNode
	selected?: boolean
	onClick?: () => void
	evaluate?: boolean
	hover?: boolean
	faded?: boolean
	className?: string
	style?: CSSProperties
	wasPlayed?: boolean
	isPlayable?: boolean
	affordable?: boolean
	conditionContext?: CardCallbackContext
	calculatedVps?: number
	highlightAction?: boolean
	highlightActionNoAnimation?: boolean
	highlightVictoryPoints?: boolean
	player?: PlayerState
	plainConditions?: boolean
}

export const StatelessCardView = ({
	card,
	selected = false,
	evaluate = true,
	hover = true,
	faded,
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
	adjustedPrice,
	adjustedPriceContext,
	highlightActionNoAnimation,
	highlightVictoryPoints,
	player,
	plainConditions,
}: Props) => {
	const locale = useLocale()
	const settings = useAppStore((state) => state.settings.data)

	const played = wasPlayed
	const playable = isPlayable

	const description = card.description

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

	const hints = useMemo(
		() =>
			evaluate
				? [
						...card.conditions.flatMap((e) => e.hints ?? []),
						...card.playEffects.flatMap((e) => e.hints ?? []),
						...(card.victoryPointsCallback?.hints ?? []),
					]
				: [],
		[card],
	)

	const allConditionsOk =
		!evaluate ||
		!condContext ||
		card.conditions.every((c) => c.evaluate(condContext))

	const cardImagesUrl = settings.cardImagesUrl ?? CARD_IMAGES_URL
	const cardImageFileName = card.code.replace(/'/g, "\\'")
	const isCorporation = card.type === CardType.Corporation

	const cardImageUrl =
		cardImagesUrl !== undefined
			? `${cardImagesUrl}/card/${cardImageFileName}.jpg`
			: undefined

	const headSymbols = (
		<Head>
			{card.type !== CardType.Corporation && card.type !== CardType.Prelude && (
				<Cost>
					<OriginalCost
						$affordable={!!affordable}
						$isAdjusted={
							adjustedPrice !== undefined && adjustedPrice !== card.cost
						}
					>
						{card.cost}
					</OriginalCost>
					{adjustedPrice !== undefined && adjustedPrice !== card.cost && (
						<AdjustedCost $affordable={!!affordable}>
							<Tooltip content={adjustedPriceContext}>{adjustedPrice}</Tooltip>
						</AdjustedCost>
					)}
				</Cost>
			)}
			{conditionSymbols.length > 0 && (
				<HeadSymbols
					$plain={plainConditions}
					$ok={!!allConditionsOk}
					symbols={conditionSymbols}
					$faded={highlightAction || highlightVictoryPoints}
				/>
			)}
			<Categories>
				{card.categories.map((c, i) => (
					<Tag key={i} tag={c} />
				))}
			</Categories>
		</Head>
	)

	return (
		<Container
			type={card.type}
			selected={selected}
			onClick={onClick}
			hover={hover}
			playable={!faded}
			played={!!played}
			style={style}
			className={
				(!evaluate || playable ? 'playable' : 'unplayable') +
				(className ? ` ${className}` : '')
			}
			$faded={!!highlightAction || !!highlightVictoryPoints}
		>
			{hints.length > 0 && player && (
				<CardHints player={player} type={card.type} hints={hints} />
			)}
			{isCorporation && (
				<CorporationTitle>
					<Title>{locale.cards[card.code]}</Title>
					{headSymbols}
				</CorporationTitle>
			)}

			{!isCorporation && (
				<>
					{headSymbols}
					<Title>{locale.cards[card.code]}</Title>
				</>
			)}

			{!isCorporation && (
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
			)}
			<Description>
				{isCorporation && (
					<>
						{state && <Resource card={card} state={state} onCorporation />}
						{card.victoryPoints !== 0 && <VP>{card.victoryPoints}</VP>}
						{card.victoryPointsCallback && (
							<VP $corporation title={card.victoryPointsCallback.description}>
								{calculatedVps ?? 'X'}*
							</VP>
						)}
					</>
				)}

				{played && <Played>Card already played this generation</Played>}

				{card.actionEffects.filter(
					(a) => a.description?.length || a.symbols.length,
				).length > 0 && (
					<Action
						$hasSymbols={symbols.length > 0}
						$highlight={highlightAction}
						$highlightNoAnimation={highlightActionNoAnimation}
						$fade={highlightVictoryPoints}
					>
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
					<Action
						$hasSymbols={symbols.length > 0}
						$fade={highlightVictoryPoints}
					>
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

				{highlightAction || highlightVictoryPoints ? (
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
						faded={highlightAction || highlightVictoryPoints}
						plain={plainConditions}
					/>
				))}

				{card.playEffects.map((e, i) => (
					<PlayEffect
						key={i}
						effect={e}
						ctx={condContext}
						evaluate={evaluate}
						faded={highlightAction || highlightVictoryPoints}
					/>
				))}
				<div
					style={
						highlightAction || highlightVictoryPoints
							? { opacity: 0.5 }
							: undefined
					}
				>
					{description}
				</div>

				{card.victoryPointsCallback && (
					<div style={highlightAction ? { opacity: 0.5 } : undefined}>
						{card.victoryPointsCallback.description}
					</div>
				)}
			</Description>
		</Container>
	)
}
