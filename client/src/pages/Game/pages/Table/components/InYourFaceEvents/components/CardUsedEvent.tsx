import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { EventLine } from '../../EventList/components/EventLine'
import { CardUsed } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: CardUsed
}

export const CardUsedEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing={' activated project'} />
			<StatelessCardView
				card={CardsLookupApi.get(event.card)}
				evaluate={false}
				hover={false}
				highlightAction
				affordable
			/>
			<div>
				{event.changes && (
					<SymbolsEventLog
						events={event.changes}
						currentPlayerId={event.playerId}
						currentUsedCardIndex={event.index}
					/>
				)}

				{event.changes?.map((c, i) => (
					<EventLine key={i} event={c} animated={false} />
				))}
			</div>
		</>
	)
}
