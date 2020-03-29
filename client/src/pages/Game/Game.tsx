import React from 'react'
import { Lobby } from './pages/Lobby/Lobby'
import { useAppStore } from '@/utils/hooks'
import { GameStateValue } from '@shared/index'
import { Table } from './pages/Table/Table'

export const Game = () => {
	const gameState = useAppStore(state => state.game.state?.state)

	return (
		<>
			{gameState === GameStateValue.WaitingForPlayers ? <Lobby /> : <Table />}
		</>
	)
}
