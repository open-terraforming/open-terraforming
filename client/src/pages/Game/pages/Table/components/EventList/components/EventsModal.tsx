import { Modal } from '@/components/Modal/Modal'
import { EventLine } from './EventLine'
import { GameEvent } from '@shared/index'

type Props = {
	events: GameEvent[]
	onClose: () => void
}

export const EventsModal = ({ onClose, events }: Props) => {
	return (
		<Modal
			open={true}
			contentStyle={{ minWidth: '500px' }}
			onClose={onClose}
			header="Events"
		>
			{/* TODO: Windowed display mode to prevent lag */}
			{[...events].reverse().map((e, i) => (
				<EventLine key={i} event={e} animated={false} timestamp />
			))}
		</Modal>
	)
}
