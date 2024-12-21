import { Modal } from '@/components/Modal/Modal'
import { TabsContent } from '@/components/TabsContent'
import { TabsHead } from '@/components/TabsHead'
import { useAppStore } from '@/utils/hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GameEvent } from '@shared/index'
import { useState } from 'react'
import { styled } from 'styled-components'
import { InYourFaceEventModal } from '../../InYourFaceEventModal'
import { EventLine } from './EventLine'
import { GroupedEventsList } from './GroupedEventsList'

type Props = {
	events: GameEvent[]
	onClose: () => void
}

enum Tabs {
	ALL = 'all',
	GROUPED = 'grouped',
}

export const EventsModal = ({ onClose, events }: Props) => {
	const [tab, setTab] = useState(Tabs.ALL)
	const [detail, setDetail] = useState<GameEvent>()

	const highlighted = useAppStore(
		(store) => store.game.highlightedCells.length > 0,
	)

	return (
		<Modal
			open={true}
			contentStyle={{
				minWidth: '600px',
				maxWidth: '600px',
			}}
			backgroundStyle={highlighted ? { opacity: 0.1 } : undefined}
			onClose={onClose}
			bodyStyle={{
				padding: 0,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'auto',
			}}
		>
			<TabsHead
				tab={tab}
				setTab={setTab}
				tabs={[
					{ title: 'All', key: Tabs.ALL },
					{ title: 'Grouped', key: Tabs.GROUPED },
				]}
				suffix={
					<CloseButton>
						<FontAwesomeIcon icon={faTimes} onClick={onClose} />
					</CloseButton>
				}
			/>

			<TabsContent
				tab={tab}
				tabs={[
					{
						key: Tabs.ALL,
						content: (
							<EventsList>
								{[...events].reverse().map((e, i) => (
									<EventLine key={i} event={e} animated={false} timestamp />
								))}
							</EventsList>
						),
					},
					{
						key: Tabs.GROUPED,
						content: (
							<EventsList>
								<GroupedEventsList onClick={(e) => setDetail(e)} />
							</EventsList>
						),
					},
				]}
			/>
			{detail && (
				<InYourFaceEventModal
					event={detail}
					onClose={() => setDetail(undefined)}
				/>
			)}
		</Modal>
	)
}

const EventsList = styled.div`
	padding: 0.5rem;
`

const CloseButton = styled.div`
	display: flex;
	align-items: center;
	padding: 0 0.5rem;
	cursor: pointer;
	margin-left: auto;
	align-self: center;
`
