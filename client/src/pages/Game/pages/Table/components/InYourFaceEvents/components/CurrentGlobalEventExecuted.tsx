import { Flex } from '@/components/Flex/Flex'
import { useGameState, usePlayerState } from '@/utils/hooks'
import { SymbolType } from '@shared/cards'
import { GlobalEventExecuted } from '@shared/index'
import { getGlobalEvent, groupBy } from '@shared/utils'
import { styled } from 'styled-components'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { GlobalEventView } from '../../GlobalEventsModal/components/GlobalEventView'
import { PlayerWithEvents } from './PlayerWithEvents'
import { SomethingHappenedHeader } from './SomethingHappenedHeader'
import { SymbolsEventLog } from './SymbolsEventLog'

type Props = {
	event: GlobalEventExecuted
}

export const CurrentGlobalEventExecutedEvent = ({ event }: Props) => {
	const game = useGameState()
	const playerId = usePlayerState().id

	const changesPerPlayer = groupBy(event.changes, (c) =>
		'playerId' in c ? c.playerId : null,
	)

	return (
		<Container>
			<SomethingHappenedHeader>Global event</SomethingHappenedHeader>

			<Flex align="center" direction="column">
				<GlobalEventView
					globalEvent={getGlobalEvent(event.eventCode)}
					highlightEffect
				/>
			</Flex>

			{game.players.map((p) => {
				const changes = changesPerPlayer.get(p.id) ?? []

				return (
					<PlayerWithEvents
						key={p.id}
						player={p}
						events={changes}
						prefix={
							<Influence>
								<SymbolDisplay symbol={{ symbol: SymbolType.Influence }} />
								{event.influencePerPlayer[p.id]}
							</Influence>
						}
					/>
				)
			})}

			<SymbolsEventLog
				events={changesPerPlayer.get(null) ?? []}
				currentPlayerId={playerId}
			/>
		</Container>
	)
}

const Container = styled.div`
	text-align: center;
	margin: 1rem 3rem;
`

const Influence = styled.div`
	width: 3rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-right: 2px solid ${({ theme }) => theme.colors.border};
`
