import { useAppStore } from '@/utils/hooks'
import React, { useMemo } from 'react'
import { CardsCounter } from '../../CardsCounter'

type Props = {
	onClick: () => void
}

export const TotalCards = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)

	const count = useMemo(() => (player ? player.usedCards.length : 0), [player])

	return (
		<CardsCounter
			onClick={onClick}
			count={count}
			text="cards"
			disabled={count === 0}
		/>
	)
}
