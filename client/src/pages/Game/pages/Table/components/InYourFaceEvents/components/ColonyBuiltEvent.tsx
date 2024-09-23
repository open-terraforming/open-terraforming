import { ColonyDisplay } from '../../ColoniesModal/components/ColonyDisplay'
import { ColonyBuilt } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: ColonyBuilt
}

export const ColonyBuiltEvent = ({ event }: Props) => {
	const highlightIndex = [...event.state.playersAtSteps.entries()]
		.reverse()
		.find(([, p]) => p === event.playerId)?.[0]

	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing={' built colony'} />
			<ColonyDisplay
				colony={event.state}
				index={-1}
				noActions
				justBuiltColonyIndex={highlightIndex}
			/>
			<SymbolsEventLog
				events={event.changes}
				currentPlayerId={event.playerId}
			/>
		</>
	)
}
