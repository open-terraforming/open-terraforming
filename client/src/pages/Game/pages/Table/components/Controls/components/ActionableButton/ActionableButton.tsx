import { Button, DialogWrapper } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import React, { useMemo } from 'react'
import { PlayedCards } from '../../../PlayedCards/PlayedCards'
import { isCardActionable } from '@shared/cards/utils'
import { CardsLookupApi } from '@shared/cards'

type Props = {
	playing: boolean
}

export const ActionableButton = ({ playing }: Props) => {
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
		<DialogWrapper
			dialog={close => <PlayedCards playing={playing} onClose={close} />}
		>
			{open => (
				<Button icon={faAngleUp} onClick={open} disabled={count === 0}>
					{count} playable cards
				</Button>
			)}
		</DialogWrapper>
	)
}
