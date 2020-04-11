import React from 'react'
import { DialogWrapper, Button } from '@/components'
import { useAppStore } from '@/utils/hooks'
import { Hand } from '../../../Hand/Hand'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'

type Props = {
	playing: boolean
}

export const HandButton = ({ playing }: Props) => {
	const count = useAppStore(state => state.game.player?.cards.length)

	return (
		<DialogWrapper
			dialog={(opened, close) =>
				opened && <Hand playing={playing} onClose={close} />
			}
		>
			{open => (
				<Button icon={faAngleUp} onClick={open} disabled={count === 0}>
					{count} cards in hand
				</Button>
			)}
		</DialogWrapper>
	)
}
