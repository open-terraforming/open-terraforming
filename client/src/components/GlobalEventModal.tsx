import { GlobalEventView } from '@/pages/Game/pages/Table/components/GlobalEventsModal/components/GlobalEventView'
import { getGlobalEvent } from '@shared/utils'
import { Modal } from './Modal/Modal'

type Props = {
	onClose: () => void
	eventCode: string
}

export const GlobalEventModal = ({ eventCode, onClose }: Props) => {
	return (
		<Modal header="Global Event" open onClose={onClose}>
			<GlobalEventView globalEvent={getGlobalEvent(eventCode)} />
		</Modal>
	)
}
