import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi, CardType } from '@shared/cards'
import { isCardActionable } from '@shared/cards/utils'
import { useMemo, useState } from 'react'
import { CardsCounter } from '../../CardsCounter'
import { CardsView } from '../../CardsView'

type Props = {
	onClick: (defaultType?: CardType) => void
}

export const ActionableButton = ({ onClick }: Props) => {
	const player = useAppStore((state) => state.game.player)
	const game = useAppStore((state) => state.game.state)
	const [opened, setOpened] = useState(false)

	const cards = useMemo(
		() =>
			player.usedCards.filter((state) =>
				isCardActionable(CardsLookupApi.get(state.code), {
					card: state,
					player,
					game,
				}),
			),
		[player, game],
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
