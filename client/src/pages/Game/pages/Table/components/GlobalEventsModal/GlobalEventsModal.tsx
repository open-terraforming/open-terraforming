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
import { Tooltip } from '@/components'
import { TooltipContent } from '@/components/TooltipContent'

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
					<Tooltip
						noSpacing
						content={
							<TooltipContent>{`Event that was revealed on start of this generation, it'll be
								moved to Coming on generation end. When distant event is
								revealed delegate from party that's in the left corner gets
								added to the committee.`}</TooltipContent>
						}
					>
						<Title>Distant</Title>
					</Tooltip>
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
					<Tooltip
						noSpacing
						content={
							<TooltipContent>
								{
									'This event will become Current on the generation end. When the event becomes Current the delegate from the party that is in the right corner gets added to the committee.'
								}
							</TooltipContent>
						}
					>
						<Title>Coming</Title>
					</Tooltip>
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
					<Tooltip
						noSpacing
						content={
							<TooltipContent>
								{
									'This event will be executed at the end of the generation, but before the Dominant Party becomes the Ruling party.'
								}
							</TooltipContent>
						}
					>
						<Title>Current</Title>
					</Tooltip>
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
