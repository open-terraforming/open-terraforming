import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { CurrentInfluenceDisplay } from './components/CurrentInfluenceDisplay'
import { GlobalEventsDisplay } from './components/GlobalEventsDisplay'

type Props = {
	onClose: () => void
}

export const GlobalEventsModal = ({ onClose }: Props) => {
	const game = useGameState()

	return (
		<Modal
			open
			onClose={onClose}
			header={
				<>
					<div>Global Events</div>
					<CurrentInfluenceDisplay />
				</>
			}
		>
			<GlobalEventsDisplay
				distantEvent={game.globalEvents.distantEvent}
				comingEvent={game.globalEvents.comingEvent}
				currentEvent={game.globalEvents.currentEvent}
			/>
		</Modal>
	)
}
