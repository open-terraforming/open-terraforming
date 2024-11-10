import { useLocale } from '@/context/LocaleContext'
import { useAppStore } from '@/utils/hooks'
import {
	Card,
	CardCallbackContext,
	CardCategory,
	CardType,
} from '@shared/cards'
import {
	adjustedCardPrice,
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice,
} from '@shared/cards/utils'
import { PlayerState, UsedCardState } from '@shared/index'
import { CSSProperties, ReactNode, useMemo } from 'react'
import { ResourceIcon } from '../ResourceIcon/ResourceIcon'
import { StatelessCardView } from './StatelessCardView'

export type CardEvaluateMode =
	| 'sponsoring'
	| 'buying'
	| 'playing'
	| 'viewing'
	| 'static'

type Props = {
	card: Card
	state?: UsedCardState
	selected?: boolean
	onClick?: () => void
	hover?: boolean
	className?: string
	style?: CSSProperties
	hideAdjustedPrice?: boolean
	highlightAction?: boolean
	highlightActionNoAnimation?: boolean
	player: PlayerState
	evaluateMode: CardEvaluateMode
}

export const CardView = ({
	card,
	selected = false,
	hover = true,
	className,
	state,
	onClick,
	style,
	hideAdjustedPrice,
	highlightAction,
	highlightActionNoAnimation,
	player,
	evaluateMode,
}: Props) => {
	const game = useAppStore((state) => state.game.state)
	const playerId = player.id
	const t = useLocale()

	if (!player || !game || playerId === undefined) {
		return <></>
	}

	const condContext = useMemo(
		() =>
			({
				card: state || emptyCardState(card.code),
				game,
				player,
			}) as CardCallbackContext,
		[state, card, game, playerId],
	)

	const adjusted =
		evaluateMode !== 'buying' ? card.cost : minimalCardPrice(card, player)

	const affordable = evaluateMode !== 'buying' || adjusted <= player.money

	const calculatedVps = useMemo(
		() =>
			(evaluateMode === 'playing' || evaluateMode === 'viewing') &&
			card.victoryPointsCallback
				? card.victoryPointsCallback.compute({
						card: state || emptyCardState(card.code),
						player,
						game,
					})
				: undefined,
		[card, player, game],
	)

	const playable = state
		? isCardActionable(card, condContext)
		: isCardPlayable(card, condContext)

	const played = card.type === CardType.Action ? state && state.played : false

	const adjustedPriceContext = useMemo(() => {
		if (
			hideAdjustedPrice ||
			evaluateMode === 'viewing' ||
			evaluateMode === 'static'
		) {
			return undefined
		}

		const context = [] as ReactNode[]

		context.push(
			...player.cardPriceChanges.map((change, index) => (
				<div key={`root-${index}`}>
					{change.change}
					<ResourceIcon res="money" />
					{change.sourceCardIndex !== undefined && (
						<> from {t.cards[player.usedCards[change.sourceCardIndex].code]}</>
					)}
				</div>
			)),
		)

		context.push(
			...player.tagPriceChanges
				.filter((change) => card.categories.includes(change.tag))
				.map((change, index) => (
					<div key={`tag-${index}`}>
						{change.change}
						<ResourceIcon res="money" />
						{change.sourceCardIndex !== undefined && (
							<>
								{' '}
								from {
									t.cards[player.usedCards[change.sourceCardIndex].code]
								}{' '}
								for {CardCategory[change.tag]}
							</>
						)}
					</div>
				)),
		)

		if (context.length === 0) {
			return undefined
		}

		return <>{context}</>
	}, [player, card, hideAdjustedPrice])

	return (
		<StatelessCardView
			card={card}
			adjustedPrice={
				hideAdjustedPrice || evaluateMode !== 'playing'
					? undefined
					: adjustedCardPrice(card, player)
			}
			adjustedPriceContext={adjustedPriceContext}
			selected={selected}
			hover={hover}
			faded={evaluateMode === 'buying' && (!affordable || !playable)}
			className={className}
			state={state}
			onClick={onClick}
			style={style}
			wasPlayed={!!played}
			isPlayable={playable}
			affordable={evaluateMode !== 'buying' || affordable}
			conditionContext={condContext}
			calculatedVps={calculatedVps}
			highlightAction={highlightAction}
			highlightActionNoAnimation={highlightActionNoAnimation}
			player={player}
			plainConditions={
				evaluateMode === 'viewing' ||
				evaluateMode === 'playing' ||
				evaluateMode === 'static'
			}
		/>
	)
}
