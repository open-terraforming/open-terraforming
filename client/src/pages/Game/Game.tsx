import React from 'react'
import { useAppStore } from '@/utils/hooks'
import { GameStateValue } from '@shared/index'
import { Loader } from '@/components'

const Lobby = React.lazy(() =>
	import(/* webpackChunkName: "lobby" */ './pages/Lobby/Lobby')
)

const Table = React.lazy(() =>
	import(/* webpackChunkName: "table" */ './pages/Table/Table')
)

export const Game = () => {
	const gameState = useAppStore(state => state.game.state?.state)

	return (
		<React.Suspense fallback={<Loader loaded={false} />}>
			{gameState === GameStateValue.WaitingForPlayers ? <Lobby /> : <Table />}
		</React.Suspense>
	)
}
