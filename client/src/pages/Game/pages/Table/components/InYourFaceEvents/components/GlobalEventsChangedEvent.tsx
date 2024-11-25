import { Flex } from '@/components/Flex/Flex'
import { GlobalEventsChanged } from '@shared/index'
import { getGlobalEvent } from '@shared/utils'
import { styled } from 'styled-components'
import { GlobalEventView } from '../../GlobalEventsModal/components/GlobalEventView'
import { SymbolsEventLog } from './SymbolsEventLog'
import { usePlayerState } from '@/utils/hooks'

type Props = {
	event: GlobalEventsChanged
}

export const GlobalEventsChangedEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id

	return (
		<Container>
			<Flex align="stretch" gap="0.5rem">
				{event.current.distant && (
					<Flex direction="column" gap="0.5rem">
						<div>NEW DISTANT EVENT</div>
						<GlobalEventView
							globalEvent={getGlobalEvent(event.current.distant)}
							highlightDistantDelegate
						/>
					</Flex>
				)}

				{event.current.current && (
					<Flex direction="column" gap="0.5rem">
						<div>NEW CURRENT EVENT</div>
						<GlobalEventView
							globalEvent={getGlobalEvent(event.current.current)}
							highlightCurrentDelegate
						/>
					</Flex>
				)}
			</Flex>

			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
