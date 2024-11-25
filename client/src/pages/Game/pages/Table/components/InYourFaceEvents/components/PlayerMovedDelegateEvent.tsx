import { usePlayerState } from '@/utils/hooks'
import { PlayerMovedDelegate } from '@shared/index'
import { styled } from 'styled-components'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: PlayerMovedDelegate
}

export const PlayerMovedDelegateEvent = ({ event }: Props) => {
	const playerId = usePlayerState().id

	return (
		<Container>
			<PlayerDidHeader playerId={event.playerId} thing={' moved delegate'} />
			<SymbolsEventLog events={event.changes} currentPlayerId={playerId} />
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`
