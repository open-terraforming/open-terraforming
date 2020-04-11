import { Button, DialogWrapper } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { PlayedCards } from '../../../PlayedCards/PlayedCards'

type Props = {
	playing: boolean
}

export const PlayedButton = ({ playing }: Props) => {
	const count = useAppStore(state => state.game.player?.usedCards.length)

	return (
		<DialogWrapper
			dialog={(opened, close) =>
				opened && <PlayedCards playing={playing} onClose={close} />
			}
		>
			{open => (
				<Button icon={faAngleUp} onClick={open} disabled={count === 0}>
					{count} cards on table
				</Button>
			)}
		</DialogWrapper>
	)
}
