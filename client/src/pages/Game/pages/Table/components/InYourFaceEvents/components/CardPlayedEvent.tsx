import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { CardPlayed } from '../../EventList/types'
import { useAppStore } from '@/utils/hooks'

type Props = {
	event: CardPlayed
}

export const CardPlayedEvent = ({ event }: Props) => {
	const player = useAppStore((state) => state.game.playerMap[event.playerId])

	return (
		<>
			<div>
				<span style={{ color: player?.color }}>{player?.name}</span>
				{' realized project'}
			</div>
			<StatelessCardView
				card={CardsLookupApi.get(event.card)}
				evaluate={false}
				hover={false}
				affordable
			/>
		</>
	)
}
