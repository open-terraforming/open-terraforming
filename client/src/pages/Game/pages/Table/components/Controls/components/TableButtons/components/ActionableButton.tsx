import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { isCardActionable } from '@shared/cards/utils'
import React, { useMemo } from 'react'
import { CardsCounter } from '../../CardsCounter'

type Props = {
	onClick: () => void
}

export const ActionableButton = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)

	const count = useMemo(
		() =>
			game && player
				? player.usedCards.filter((c, cardIndex) =>
						isCardActionable(CardsLookupApi.get(c.code), {
							card: c,
							cardIndex,
							player,
							game,
							playerId: player.id
						})
				  ).length
				: 0,
		[player, game]
	)

	return (
		<CardsCounter
			onClick={onClick}
			count={count}
			text="playable"
			disabled={count === 0}
		/>
	)
}
