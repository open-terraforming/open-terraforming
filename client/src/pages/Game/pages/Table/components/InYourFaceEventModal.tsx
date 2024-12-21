import { Modal } from '@/components/Modal/Modal'
import { GameEvent } from '@shared/index'
import { InYourFaceEvent } from './InYourFaceEvents/components/InYourFaceEvent'
import { useAppStore } from '@/utils/hooks'

type Props = {
	event: GameEvent
	onClose: () => void
}

export const InYourFaceEventModal = ({ event, onClose }: Props) => {
	const highlighted = useAppStore(
		(store) => store.game.highlightedCells.length > 0,
	)

	return (
		<Modal
			header={<></>}
			open={true}
			onClose={onClose}
			backgroundStyle={highlighted ? { opacity: 0.1 } : undefined}
		>
			<InYourFaceEvent event={event} />
		</Modal>
	)
}
