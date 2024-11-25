import { usePlayerState } from '@/utils/hooks'
import { NewGovernment } from '@shared/index'
import { styled } from 'styled-components'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: NewGovernment
}

export const NewGovernmentEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id

	return (
		<Container>
			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	font-size: 125%;
	text-align: center;
	margin: 1rem 3rem;
`
