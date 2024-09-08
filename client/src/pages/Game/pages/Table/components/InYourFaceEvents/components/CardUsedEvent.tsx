import { useAppStore } from '@/utils/hooks'
import { CardsLookupApi } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { CardUsed } from '../../EventList/types'

type Props = {
	event: CardUsed
}

export const CardUsedEvent = ({ event }: Props) => {
	const player = useAppStore((state) => state.game.playerMap[event.playerId])

	return (
		<>
			<div>
				<span style={{ color: player?.color }}>{player?.name}</span>
				{' activated project'}
			</div>
			<StatelessCardView
				card={CardsLookupApi.get(event.card)}
				evaluate={false}
				hover={false}
				highlightAction
				affordable
			/>
		</>
	)
}
