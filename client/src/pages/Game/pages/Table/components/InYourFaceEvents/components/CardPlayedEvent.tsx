import { CardsLookupApi, CardType } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { CardPlayed } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: CardPlayed
}

export const CardPlayedEvent = ({ event }: Props) => {
	const cardInfo = CardsLookupApi.get(event.card)

	return (
		<>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={
					cardInfo.type === CardType.Prelude
						? ' picked prelude'
						: ' realized project'
				}
			/>
			<StatelessCardView
				card={cardInfo}
				evaluate={false}
				hover={false}
				affordable
			/>
			<div>
				{event.changes && (
					<SymbolsEventLog
						events={event.changes}
						currentPlayerId={event.playerId}
					/>
				)}
			</div>
		</>
	)
}
