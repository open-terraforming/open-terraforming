import { Button } from '@/components'
import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, usePlayerState } from '@/utils/hooks'
import { useMemo, useState } from 'react'
import { isInYourFaceEvent } from '../utils/isInYourFaceEvent'
import { InYourFaceEvent } from './InYourFaceEvent'

type Props = {
	onClose: () => void
}

export const InYourFaceEventsList = ({ onClose }: Props) => {
	const player = usePlayerState()
	const events = useAppStore((store) => store.game.events)

	const allEvents = useMemo(
		() =>
			events.filter((event) => {
				return (
					(!('playerId' in event) || event.playerId !== player.id) &&
					isInYourFaceEvent({ event })
				)
			}),
		[events],
	)

	const [index, setIndex] = useState(allEvents.length - 1)

	return (
		<Modal onClose={onClose} open>
			<Box gap="0.5rem" $mb={4} style={{ minWidth: '30rem' }} justify="center">
				<Button
					onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : prev))}
				>
					Prev
				</Button>
				{index + 1} / {allEvents.length}
				<Button
					onClick={() =>
						setIndex((prev) => (prev < allEvents.length - 2 ? prev + 1 : prev))
					}
				>
					Next
				</Button>
			</Box>

			<Flex direction="column">
				<InYourFaceEvent key={index} event={allEvents[index]} />
			</Flex>
		</Modal>
	)
}
