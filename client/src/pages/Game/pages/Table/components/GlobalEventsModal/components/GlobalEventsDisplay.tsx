import { Tooltip } from '@/components'
import { Flex } from '@/components/Flex/Flex'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getGlobalEvent } from '@shared/utils'
import { styled } from 'styled-components'
import { EmptyGlobalEventView } from './EmptyGlobalEventView'
import { GlobalEventView } from './GlobalEventView'

export type Props = {
	distantEvent: string | null
	comingEvent: string | null
	currentEvent: string | null
}

export const GlobalEventsDisplay = ({
	distantEvent,
	comingEvent,
	currentEvent,
}: Props) => {
	return (
		<Flex align="stretch" gap="0.5rem">
			<Flex direction="column">
				<Tooltip
					content={`Event that was revealed on start of this generation, it'll be
								moved to Coming on generation end. When distant event is
								revealed delegate from party that's in the left corner gets
								added to the committee.`}
				>
					<Title>Distant</Title>
				</Tooltip>
				{distantEvent && (
					<GlobalEventView globalEvent={getGlobalEvent(distantEvent)} />
				)}
			</Flex>
			<Arrow>
				<FontAwesomeIcon icon={faChevronRight} />
			</Arrow>
			<Flex direction="column">
				<Tooltip
					content={
						'This event will become Current on the generation end. When the event becomes Current the delegate from the party that is in the right corner gets added to the committee.'
					}
				>
					<Title>Coming</Title>
				</Tooltip>
				{comingEvent && (
					<GlobalEventView globalEvent={getGlobalEvent(comingEvent)} />
				)}
			</Flex>
			<Arrow>
				<FontAwesomeIcon icon={faChevronRight} />
			</Arrow>
			<Flex direction="column">
				<Tooltip
					content={
						'This event will be executed at the end of the generation, but before the Dominant Party becomes the Ruling party.'
					}
				>
					<Title>Current</Title>
				</Tooltip>
				{currentEvent ? (
					<GlobalEventView globalEvent={getGlobalEvent(currentEvent)} />
				) : (
					<EmptyGlobalEventView />
				)}
			</Flex>
		</Flex>
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
