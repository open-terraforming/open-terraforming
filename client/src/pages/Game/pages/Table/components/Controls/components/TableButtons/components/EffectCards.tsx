import React, { useMemo, useState } from 'react'
import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { CardsCounter } from '../../CardsCounter'
import { CardsView } from '../../CardsView'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const EffectCards = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)
	const [opened, setOpened] = useState(false)

	const cards = useMemo(
		() =>
			player.usedCards
				.map((c, cardIndex) => ({ state: c, cardIndex }))
				.filter(
					({ state }) => CardsLookupApi.get(state.code).type === CardType.Effect
				),
		[player]
	)

	const handleClick = () => {
		onClick(CardType.Effect)
	}

	return (
		<CardsCounter
			onClick={handleClick}
			count={cards.length}
			text="effects"
			disabled={cards.length === 0}
			onMouseOver={() => setOpened(true)}
			onMouseLeave={() => setOpened(false)}
		>
			<CardsView cards={cards} play open={opened} openable={false} />
		</CardsCounter>
	)
}
