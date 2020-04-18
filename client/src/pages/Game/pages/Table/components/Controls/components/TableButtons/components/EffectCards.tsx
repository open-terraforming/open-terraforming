import React, { useMemo } from 'react'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { CardsCounter } from '../../CardsCounter'

type Props = {
	onClick: () => void
}

export const EffectCards = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)

	const count = useMemo(
		() =>
			player
				? player.usedCards.filter(
						c => CardsLookupApi.get(c.code).type === CardType.Effect
				  ).length
				: 0,
		[player]
	)

	return (
		<CardsCounter
			onClick={onClick}
			count={count}
			text="effects"
			disabled={count === 0}
		/>
	)
}
