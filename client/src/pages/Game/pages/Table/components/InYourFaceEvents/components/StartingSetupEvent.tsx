import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { StartingSetup } from '../../EventList/types'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'
import { Flex } from '@/components/Flex/Flex'

type Props = {
	event: StartingSetup
}

export const StartingSetupEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader
				playerId={event.playerId}
				thing={' picked their starting setup'}
			/>

			<Flex>
				<StatelessCardView
					card={CardsLookupApi.get(event.corporation)}
					evaluate={false}
					hover={false}
					affordable
				/>

				{event.preludes.map((card, i) => (
					<StatelessCardView
						key={i}
						card={CardsLookupApi.get(card)}
						evaluate={false}
						hover={false}
						affordable
					/>
				))}
			</Flex>

			{event.changes && (
				<SymbolsEventLog
					events={event.changes}
					currentPlayerId={event.playerId}
				/>
			)}
		</>
	)
}
