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

			<EventList />
		</PlayersContainer>
	)
}

const PlayersContainer = styled.div`
	margin-top: 5rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 15rem;
	overflow: hidden;
	z-index: 2;
`

const PlayersList = styled.div`
	max-height: 50%;
	overflow: auto;
`
