import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { EventLine } from '../../EventList/components/EventLine'
import { CardUsed } from '../../EventList/types'
import { SymbolsEventLog } from './SymbolsEventLog'
import styled from 'styled-components'

type Props = {
	event: CardUsed
}

export const CardUsedEvent = ({ event }: Props) => {
	const player = useAppStore((state) => state.game.playerMap[event.playerId])

	return (
		<>
			<Header>
				<span style={{ color: player?.color }}>{player?.name}</span>
				{' activated project'}
			</Header>
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

const Header = styled.div`
	text-align: center;
	margin: 0.25rem 0 1rem 0;
`
