import { TilePlaced } from '@shared/index'
import styled from 'styled-components'
import { Symbols } from '../../CardView/components/Symbols'
import { PlayerDidHeader } from './PlayerDidHeader'

type Props = {
	event: TilePlaced
}

export const TilePlacedEvent = ({ event }: Props) => {
	return (
		<>
			<PlayerDidHeader playerId={event.playerId} thing=" placed tile" />

			<BigSymbols>
				<Symbols symbols={[{ tile: event.tile, tileOther: event.other }]} />
			</BigSymbols>
		</>
	)
}

const BigSymbols = styled.div`
	font-size: 200%;
`
