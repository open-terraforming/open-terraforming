import { Flex } from '@/components/Flex/Flex'
import { Modal } from '@/components/Modal/Modal'
import { useGameState } from '@/utils/hooks'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getGlobalEvent } from '@shared/utils'
import { styled } from 'styled-components'
import { CurrentInfluenceDisplay } from './components/CurrentInfluenceDisplay'
import { EmptyGlobalEventView } from './components/EmptyGlobalEventView'
import { GlobalEventView } from './components/GlobalEventView'

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
			<Flex align="stretch" gap="0.5rem">
				<Flex direction="column">
					<Title>Distant</Title>
					{game.globalEvents.distantEvent && (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.distantEvent)}
						/>
					)}
				</Flex>
				<Arrow>
					<FontAwesomeIcon icon={faChevronRight} />
				</Arrow>
				<Flex direction="column">
					<Title>Coming</Title>
					{game.globalEvents.comingEvent && (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.comingEvent)}
						/>
					)}
				</Flex>
				<Arrow>
					<FontAwesomeIcon icon={faChevronRight} />
				</Arrow>
				<Flex direction="column">
					<Title>Current</Title>
					{game.globalEvents.currentEvent ? (
						<GlobalEventView
							globalEvent={getGlobalEvent(game.globalEvents.currentEvent)}
						/>
					) : (
						<EmptyGlobalEventView />
					)}
				</Flex>
			</Flex>
		</Modal>
	)
}

const Title = styled.div`
	font-size: 125%;
	text-align: center;
	margin-bottom: 1rem;
	text-transform: uppercase;
`

const Arrow = styled.div`
	font-size: 250%;
	color: ${({ theme }) => theme.colors.border};
	display: flex;
	align-items: center;
	margin: 0.5rem;
`
