import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { GlobalEventView } from './components/GlobalEventView'
import { getGlobalEvent } from '@shared/utils'
import { EmptyGlobalEventView } from './components/EmptyGlobalEventView'

type Props = {
	onClose: () => void
}

export const GlobalEventsModal = ({ onClose }: Props) => {
	const game = useGameState()

	return (
		<Modal open onClose={onClose} header="Global Events">
			<Flex align="stretch" gap="0.5rem">
				<div>
					<div>Distant</div>
					{game.globalEvents.distantEvent && (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.distantEvent)}
						/>
					)}
				</div>
				<div>
					<div>Coming</div>
					{game.globalEvents.comingEvent && (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.comingEvent)}
						/>
					)}
				</div>
				<div>
					<div>Current</div>
					{game.globalEvents.currentEvent ? (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.currentEvent)}
						/>
					) : (
						<EmptyGlobalEventView />
					)}
				</div>
			</Flex>
		</Modal>
	)
}
