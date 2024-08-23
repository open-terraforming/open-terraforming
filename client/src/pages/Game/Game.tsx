import { useAppStore } from '@/utils/hooks'
import { GameStateValue } from '@shared/index'
import { Loader } from '@/components'
import { lazy, Suspense } from 'react'

const Lobby = lazy(
	() => import(/* webpackChunkName: "lobby" */ './pages/Lobby/Lobby'),
)

const Table = lazy(
	() => import(/* webpackChunkName: "table" */ './pages/Table/Table'),
)

export const Game = () => {
	const gameState = useAppStore((state) => state.game.state?.state)

	return (
		<Suspense fallback={<Loader loaded={false} />}>
			{gameState === GameStateValue.WaitingForPlayers ? <Lobby /> : <Table />}
		</Suspense>
	)
}
