import { TilePlaced } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: TilePlaced
}

export const TilePlacedEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing=" placed tile" />

			<SymbolsEventLog currentPlayerId={event.playerId} events={[event]} />
		</>
	)
}
