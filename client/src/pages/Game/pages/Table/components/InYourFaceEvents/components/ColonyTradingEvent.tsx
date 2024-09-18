import { ColonyDisplay } from '../../ColoniesModal/components/ColonyDisplay'
import { ColonyTrading } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: ColonyTrading
}

export const ColonyTradingEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' traded with colony'}
			/>
			<ColonyDisplay colony={event.state} index={-1} noActions />
			<SymbolsEventLog
				events={event.changes}
				currentPlayerId={event.playerId}
			/>
		</>
	)
}
