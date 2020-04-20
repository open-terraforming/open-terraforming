import { useAppStore } from '@/utils/hooks'
import React, { useMemo } from 'react'
import { CardsCounter } from '../../CardsCounter'
import { CardType } from '@shared/cards'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const TotalCards = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)

	const count = useMemo(() => (player ? player.usedCards.length : 0), [player])

	const handleClick = () => {
		onClick()
	}

	return (
		<CardsCounter
			onClick={handleClick}
			count={count}
			text="all"
			disabled={count === 0}
		/>
	)
}
