import { Button } from '@/components'
import { Box } from '@/components/Box'
import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useAppStore, usePlayerState } from '@/utils/hooks'
import {
	faChevronLeft,
	faChevronRight,
	faList,
} from '@fortawesome/free-solid-svg-icons'
import { GameEvent } from '@shared/index'
import { useMemo, useState } from 'react'
import { GroupedEventsList } from '../../EventList/components/GroupedEventsList'
import { InYourFaceEventModal } from '../../InYourFaceEventModal'
import { isInYourFaceEvent } from '../utils/isInYourFaceEvent'
import { InYourFaceEvent } from './InYourFaceEvent'
import { styled } from 'styled-components'

type Props = {
	onClose: () => void
}

export const InYourFaceEventsList = ({ onClose }: Props) => {
	const player = usePlayerState()
	const events = useAppStore((store) => store.game.events)

	const highlight = useAppStore(
		(store) => store.game.highlightedCells.length > 0,
	)

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

	const [listMode, setListMode] = useState(false)
	const [index, setIndex] = useState(allEvents.length - 1)
	const [detail, setDetail] = useState<GameEvent>()

	return (
		<Modal
			header={'Events history'}
			onClose={onClose}
			open
			bodyStyle={{
				minWidth: '30rem',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
			}}
			backgroundStyle={highlight ? { opacity: 0.1 } : undefined}
		>
			<Head $mb={2}>
				{!listMode && (
					<>
						<Box>
							<Button onClick={() => setListMode(true)} icon={faList}>
								Show list
							</Button>
						</Box>
						<Box gap="0.5rem" $ml="auto" justify="center">
							<Button
								onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : prev))}
								icon={faChevronLeft}
							/>
							{index + 1} / {allEvents.length}
							<Button
								onClick={() =>
									setIndex((prev) =>
										prev < allEvents.length - 1 ? prev + 1 : prev,
									)
								}
								icon={faChevronRight}
							/>
						</Box>
					</>
				)}

				{listMode && (
					<Button onClick={() => setListMode(false)}>Show events</Button>
				)}
			</Head>

			{!listMode && (
				<Flex direction="column">
					<InYourFaceEvent key={index} event={allEvents[index]} />
				</Flex>
			)}

			{listMode && (
				<Content>
					<GroupedEventsList onClick={(e) => setDetail(e)} />
				</Content>
			)}

			{detail && (
				<InYourFaceEventModal
					event={detail}
					onClose={() => setDetail(undefined)}
				/>
			)}
		</Modal>
	)
}

const Content = styled.div`
	flex: 1;
	overflow: auto;
`

const Head = styled(Box)`
	flex-grow: 0;
	flex-shrink: 0;
`
