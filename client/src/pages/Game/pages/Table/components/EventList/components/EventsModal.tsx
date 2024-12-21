import { Modal } from '@/components/Modal/Modal'
import { TabsContent } from '@/components/TabsContent'
import { TabsHead } from '@/components/TabsHead'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GameEvent } from '@shared/index'
import { useState } from 'react'
import { styled } from 'styled-components'
import { InYourFaceEventModal } from '../../InYourFaceEventModal'
import { EventLine } from './EventLine'
import { GroupedEventsList } from './GroupedEventsList'
import { useAppStore } from '@/utils/hooks'

type Props = {
	events: GameEvent[]
	onClose: () => void
}

export const EventsModal = ({ onClose, events }: Props) => {
	const [tab, setTab] = useState('all')
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
					{ title: 'All', key: 'all' },
					{ title: 'Grouped', key: 'grouped' },
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
						key: 'all',
						content: (
							<EventsList>
								{[...events].reverse().map((e, i) => (
									<EventLine key={i} event={e} animated={false} timestamp />
								))}
							</EventsList>
						),
					},
					{
						key: 'grouped',
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
