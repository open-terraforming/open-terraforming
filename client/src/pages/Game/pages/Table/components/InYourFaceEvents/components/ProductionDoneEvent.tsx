import styled, { keyframes } from 'styled-components'
import { ProductionDone } from '@shared/index'
import { PlayerDidHeader } from './PlayerDidHeader'
import { SymbolsEventLog } from './SymbolsEventLog'
import { useAppStore } from '@/utils/hooks'

type Props = {
	event: ProductionDone
}

export const ProductionDoneEvent = ({ event }: Props) => {
	const currentPlayerId = useAppStore((state) => state.game.playerId)

	// Put the current player first
	const sorted = event.players.slice().sort((a, b) => {
		if (a.playerId === currentPlayerId) {
			return -1
		}

		if (b.playerId === currentPlayerId) {
			return 1
		}

		return 0
	})

	return (
		<>
			{sorted.map((event, i) => {
				return (
					<ProductionContainer
						key={event.playerId}
						style={{ animationDelay: `${i * 250}ms` }}
					>
						<PlayerDidHeader playerId={event.playerId} thing={' produced'} />
						<SymbolsEventLog
							events={[event]}
							currentPlayerId={event.playerId}
							maxWidth="25rem"
						/>
					</ProductionContainer>
				)
			})}
		</>
	)
}

const fadeIn = keyframes`
	0% { opacity: 0; transform: scale(1.2) }
	100% { opacity: 1; transform: scale(1) }
`

const ProductionContainer = styled.div`
	position: relative;
	animation-name: ${fadeIn};
	animation-duration: 0.25s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	opacity: 0;
`
