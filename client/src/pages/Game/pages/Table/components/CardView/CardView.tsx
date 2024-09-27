import { useAppStore } from '@/utils/hooks'
import { Card, CardCallbackContext, CardType } from '@shared/cards'
import {
	adjustedCardPrice,
	emptyCardState,
	isCardActionable,
	isCardPlayable,
	minimalCardPrice,
} from '@shared/cards/utils'
import { UsedCardState } from '@shared/index'
import { CSSProperties, useMemo } from 'react'
import { StatelessCardView } from './StatelessCardView'

type Props = {
	card: Card
	state?: UsedCardState
	selected?: boolean
	onClick?: () => void
	buying?: boolean
	evaluate?: boolean
	hover?: boolean
	fade?: boolean
	className?: string
	style?: CSSProperties
}

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
	style,
}: Props) => {
	const game = useAppStore((state) => state.game.state)
	const player = useAppStore((state) => state.game.player)
	const playerId = useAppStore((state) => state.game.playerId)

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

	const adjusted = !buying ? card.cost : minimalCardPrice(card, player)

	const affordable = !buying || adjusted <= player.money

	const calculatedVps = useMemo(
		() =>
			evaluate && !buying && card.victoryPointsCallback
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

	return (
		<StatelessCardView
			card={card}
			adjustedPrice={adjustedCardPrice(card, player)}
			selected={selected}
			evaluate={evaluate}
			hover={hover}
			fade={fade}
			className={className}
			state={state}
			onClick={onClick}
			style={style}
			wasPlayed={!!played}
			isPlayable={playable}
			affordable={affordable}
			conditionContext={condContext}
			calculatedVps={calculatedVps}
		/>
	)
}
