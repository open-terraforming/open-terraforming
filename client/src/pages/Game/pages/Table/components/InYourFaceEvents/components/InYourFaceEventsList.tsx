import { Button } from '@/components'
import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { formatTime } from '@/utils/formatTime'
import { useAppStore, useGameState, usePlayerState } from '@/utils/hooks'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { isInYourFaceEvent } from '../utils/isInYourFaceEvent'
import { InYourFaceEvent } from './InYourFaceEvent'
import { InYourFaceEventTitle } from './InYourFaceEventTitle'

type Props = {
	onClose: () => void
}

export const InYourFaceEventsList = ({ onClose }: Props) => {
	const game = useGameState()
	const player = usePlayerState()
	const events = useAppStore((store) => store.game.events)

	const [listMode, setListMode] = useState(false)

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

	const allEventsReversed = useMemo(() => [...allEvents].reverse(), [allEvents])

	const [index, setIndex] = useState(allEvents.length - 1)

	const gameStart = new Date(game.started)

	return (
		<Modal
			header={'Events history'}
			onClose={onClose}
			open
			bodyStyle={{ minWidth: '30rem' }}
		>
			{!listMode && (
				<Box $mb={4}>
					<Box>
						<Button onClick={() => setListMode(true)}>Show list</Button>
					</Box>
					<Box gap="0.5rem" $ml="auto" justify="center">
						<Button
							onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : prev))}
						>
							Prev
						</Button>
						{index + 1} / {allEvents.length}
						<Button
							onClick={() =>
								setIndex((prev) =>
									prev < allEvents.length - 1 ? prev + 1 : prev,
								)
							}
						>
							Next
						</Button>
					</Box>
				</Box>
			)}

			{!listMode && (
				<Flex direction="column">
					<InYourFaceEvent key={index} event={allEvents[index]} />
				</Flex>
			)}

			{listMode &&
				allEventsReversed.map((e, i) => (
					<Box
						key={i}
						onClick={() => {
							setIndex(allEvents.length - 1 - i)
							setListMode(false)
						}}
					>
						<Timestamp>{formatTime(e.t - gameStart.getTime())}</Timestamp>
						<InYourFaceEventTitle event={e} />
					</Box>
				))}
		</Modal>
	)
}

const Timestamp = styled.div`
	width: 4rem;
	text-align: right;
	margin-right: 0.5rem;
`
