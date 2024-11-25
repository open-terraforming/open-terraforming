import { usePlayerState } from '@/utils/hooks'
import { GlobalEventExecuted } from '@shared/index'
import { getGlobalEvent } from '@shared/utils'
import { styled } from 'styled-components'
import { GlobalEventView } from '../../GlobalEventsModal/components/GlobalEventView'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: GlobalEventExecuted
}

export const CurrentGlobalEventExecutedEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id

	return (
		<Container>
			<GlobalEventView
				globalEvent={getGlobalEvent(event.eventCode)}
				highlightEffect
			/>
			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
