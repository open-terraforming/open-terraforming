import { useApi } from '@/context/ApiContext'
import { useGameState } from '@/utils/hooks'
import { localSessionsStore } from '@/utils/localSessionsStore'
import { GameStateValue } from '@shared/gameState'
import { useEffect } from 'react'

export const SessionController = () => {
	const api = useApi()
	const game = useGameState()

	// Update session data when game changes
	useEffect(() => {
		// Wait until game is connected
		if (!api?.gameId) {
			return
		}

		const sessionKey = api.gameId

		// Ensure the game state isn't outdated
		if (sessionKey !== game.id) {
			return
		}

		// Save some basic game info into session store
		localSessionsStore.setGameData(sessionKey, {
			name: game.name,
			generation: game.generation,
			finished: game.state === GameStateValue.Ended,
			lastUpdateAt: Date.now(),
		})
	}, [game])

	return <></>
}
