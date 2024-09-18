import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { CardPlayed } from '../../EventList/types'
import { useAppStore } from '@/utils/hooks'
import { EventLine } from '../../EventList/components/EventLine'
import { SymbolsEventLog } from './SymbolsEventLog'
import { styled } from 'styled-components'

type Props = {
	event: CardPlayed
}

export const CardPlayedEvent = ({ event }: Props) => {
	const player = useAppStore((state) => state.game.playerMap[event.playerId])

	return (
		<>
			<Header>
				<span style={{ color: player?.color }}>{player?.name}</span>
				{' realized project'}
			</Header>
			<StatelessCardView
				card={CardsLookupApi.get(event.card)}
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
