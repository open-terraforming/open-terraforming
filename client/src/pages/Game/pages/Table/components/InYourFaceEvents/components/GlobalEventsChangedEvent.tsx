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
			<Flex>
				{event.current.distant && (
					<div>
						<div>NEW DISTANT EVENT</div>
						<GlobalEventView
							globalEvent={getGlobalEvent(event.current.distant)}
						/>
					</div>
				)}

				{event.current.current && (
					<div>
						<div>NEW CURRENT EVENT</div>
						<GlobalEventView
							globalEvent={getGlobalEvent(event.current.current)}
						/>
					</div>
				)}
			</Flex>

			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 1rem 3rem;
`
