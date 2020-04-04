import React, { useState } from 'react'
import { useAppStore } from '@/utils/hooks'
import { Player } from './components/Player'
import styled from 'styled-components'
import { PlayerInfo } from './components/PlayerInfo/PlayerInfo'
import { EventList } from '../EventList/EventList'

export const Players = () => {
	const startingPlayer = useAppStore(state => state.game.state?.startingPlayer)
	const players = useAppStore(state => state.game.state?.players)

	const [showingPlayerId, setShowingPlayerId] = useState(
		undefined as number | undefined
	)

	return (
		<PlayersContainer>
			{showingPlayerId !== undefined && (
				<PlayerInfo
					playerId={showingPlayerId}
					onClose={() => setShowingPlayerId(undefined)}
				/>
			)}

			{players?.map((p, i) => (
				<Player
					player={p}
					key={p.id}
					starting={i === startingPlayer}
					onClick={() => setShowingPlayerId(p.id)}
				/>
			))}

			<EventList />
		</PlayersContainer>
	)
}

const PlayersContainer = styled.div`
	margin-top: 5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`
