import { ColonyDisplay } from '../../ColoniesModal/components/ColonyDisplay'
import { ColonyBuilt } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: ColonyBuilt
}

export const ColonyBuiltEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing={' built colony'} />
			<ColonyDisplay colony={event.state} index={-1} noActions />
			<SymbolsEventLog
				events={event.changes}
				currentPlayerId={event.playerId}
			/>
		</>
	)
}
