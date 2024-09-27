import { CardsLookupApi, CardType } from '@shared/cards'
import { StatelessCardView } from '../../CardView/StatelessCardView'
import { CardPlayed } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'
import { keyframes, styled } from 'styled-components'

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
			<AnimationContainer>
				<StatelessCardView
					card={cardInfo}
					evaluate={false}
					hover={false}
					affordable
				/>
			</AnimationContainer>
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

const popInAnimation = keyframes`
	0% { transform: scale(1.3); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
`

const AnimationContainer = styled.div`
	animation-name: ${popInAnimation};
	animation-duration: 0.3s;
`
