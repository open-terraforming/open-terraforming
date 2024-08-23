import { useAppStore } from '@/utils/hooks'
import { useState } from 'react'
import styled from 'styled-components'
import { Player } from './components/Player'
import { PlayerInfo } from './components/PlayerInfo/PlayerInfo'

export const Players = () => {
	const startingPlayer = useAppStore(
		(state) => state.game.state?.startingPlayer,
	)

	const players = useAppStore((state) => state.game.state?.players)

	const [showingPlayerId, setShowingPlayerId] = useState(
		undefined as number | undefined,
	)

	return (
		<PlayersContainer>
			{showingPlayerId !== undefined && (
				<PlayerInfo
					playerId={showingPlayerId}
					onClose={() => setShowingPlayerId(undefined)}
				/>
			)}

			<PlayersList>
				{players?.map((p, i) => (
					<Player
						player={p}
						key={p.id}
						starting={i === startingPlayer}
						onClick={() => setShowingPlayerId(p.id)}
					/>
				))}
			</PlayersList>
		</PlayersContainer>
	)
}

const PlayersContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: absolute;
	top: 5rem;
	left: 0;
	width: 17rem;
	overflow: hidden;
	z-index: 2;
	overflow: auto;
	max-height: 50%;
`

const PlayersList = styled.div`
	max-height: 50%;
`
