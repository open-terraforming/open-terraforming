import { useAppStore, usePlayersMap } from '@/utils/hooks'
import { GameEvent, ProductionDone } from '@shared/index'
import styled, { keyframes } from 'styled-components'
import { PlayerWithEvents } from './PlayerWithEvents'
import { SomethingHappenedHeader } from './SomethingHappenedHeader'

type Props = {
	event: ProductionDone
}

export const ProductionDoneEvent = ({ event }: Props) => {
	const currentPlayerId = useAppStore((state) => state.game.playerId)
	const playersMap = usePlayersMap()

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
			<SomethingHappenedHeader>Production</SomethingHappenedHeader>

			{sorted.map((event, i) => (
				<StyledEvents
					key={event.playerId}
					style={{ animationDelay: `${i * 250}ms` }}
					player={playersMap[event.playerId]}
					events={[event as GameEvent]}
				/>
			))}
		</>
	)
}

const fadeIn = keyframes`
	0% { opacity: 0; transform: scale(1.2) }
	100% { opacity: 1; transform: scale(1) }
`

const StyledEvents = styled(PlayerWithEvents)`
	width: 25rem;
	position: relative;
	animation-name: ${fadeIn};
	animation-duration: 0.25s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
	opacity: 0;
`
