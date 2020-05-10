import React, { useState } from 'react'
import { useAppStore } from '@/utils/hooks'
import styled from 'styled-components'
import { Player } from './components/Player'
import { PlayerInfo } from '../Players/components/PlayerInfo/PlayerInfo'

type Props = {}

export const Spectator = ({}: Props) => {
	const players = useAppStore(state => state.game.state.players)

	const [showingPlayerId, setShowingPlayerId] = useState(
		undefined as number | undefined
	)

	return (
		<C>
			{showingPlayerId !== undefined && (
				<PlayerInfo
					playerId={showingPlayerId}
					onClose={() => setShowingPlayerId(undefined)}
				/>
			)}

			{players.map(p => (
				<Player
					onClick={() => setShowingPlayerId(p.id)}
					key={p.id}
					player={p}
				/>
			))}
		</C>
	)
}

const C = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	position: relative;
	z-index: 4;
`
