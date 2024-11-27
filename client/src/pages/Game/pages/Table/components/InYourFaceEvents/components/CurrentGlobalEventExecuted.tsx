import { useGameState, usePlayerState } from '@/utils/hooks'
import { GlobalEventExecuted } from '@shared/index'
import { getGlobalEvent, groupBy } from '@shared/utils'
import { styled } from 'styled-components'
import { GlobalEventView } from '../../GlobalEventsModal/components/GlobalEventView'
import { SymbolsEventLog } from './SymbolsEventLog'
import { SomethingHappenedHeader } from './SomethingHappenedHeader'
import { SymbolDisplay } from '../../CardView/components/SymbolDisplay'
import { SymbolType } from '@shared/cards'
import { Flex } from '@/components/Flex/Flex'

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

			<GlobalEventView
				globalEvent={getGlobalEvent(event.eventCode)}
				highlightEffect
			/>

			{game.players.map((p) => {
				const changes = changesPerPlayer.get(p.id) ?? []

				return (
					<PlayerContainer key={p.id}>
						<Flex justify="center">
							<span>
								<span style={{ color: p.color }}>{p.name}</span>
								{' with '}
							</span>
							<SymbolDisplay symbol={{ symbol: SymbolType.Influence }} />
							{event.influencePerPlayer[p.id]}
						</Flex>
						{changes.length > 0 && (
							<SymbolsEventLog
								events={changesPerPlayer.get(p.id) ?? []}
								currentPlayerId={p.id}
								noSpacing
							/>
						)}
						{changes.length === 0 && <Nothing>Nothing</Nothing>}
					</PlayerContainer>
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

const Nothing = styled.div`
	padding: 0.5rem;
	font-size: 125%;
	opacity: 0.5;
	text-transform: uppercase;
`

const PlayerContainer = styled.div`
	margin: 0.5rem 0;
`
