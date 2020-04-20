import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { isCardActionable } from '@shared/cards/utils'
import React, { useMemo, useState } from 'react'
import { CardsCounter } from '../../CardsCounter'
import { CardsView } from '../../CardsView'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const ActionableButton = ({ onClick }: Props) => {
	const player = useAppStore(state => state.game.player)
	const game = useAppStore(state => state.game.state)
	const [opened, setOpened] = useState(false)

	const cards = useMemo(
		() =>
			player.usedCards
				.map((c, cardIndex) => ({ state: c, cardIndex }))
				.filter(({ state, cardIndex }) =>
					isCardActionable(CardsLookupApi.get(state.code), {
						card: state,
						cardIndex,
						player,
						game,
						playerId: player.id
					})
				),
		[player, game]
	)

	const handleClick = () => {
		onClick(CardType.Action)
	}

	return (
		<CardsCounter
			onClick={handleClick}
			count={cards.length}
			text="playable"
			disabled={cards.length === 0}
			onMouseOver={() => setOpened(true)}
			onMouseLeave={() => setOpened(false)}
		>
			<CardsView cards={cards} play open={opened} />
		</CardsCounter>
	)
}