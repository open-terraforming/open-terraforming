import React from 'react'
import { Container } from '@/components/Container'
import { useAppStore, useApi } from '@/utils/hooks'
import { Player } from './components/Player'
import { PlayerStateValue, playerReady } from '@shared/index'
import { Button } from '@/components'

export const Lobby = () => {
	const api = useApi()
	const players = useAppStore(state => state.game.state?.players)
	const player = useAppStore(state => state.game.player)
	const isReady = player?.gameState.state === PlayerStateValue.Ready

	const handleReady = () => {
		api.send(playerReady(!isReady))
	}

	return (
		<Container>
			<h2>Waiting for other players</h2>

			{players?.map(p => (
				<Player
					name={p.name}
					key={p.id}
					ready={p.gameState.state === PlayerStateValue.Ready}
				/>
			))}

			<Button onClick={handleReady}>
				{player?.gameState.state === PlayerStateValue.Ready
					? 'Unready'
					: 'Ready'}
			</Button>
		</Container>
	)
}
