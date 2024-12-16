import { useApi } from '@/context/ApiContext'
import { setClientState } from '@/store/modules/client'
import { useAppDispatch, useAppStore, useGameState } from '@/utils/hooks'
import { GameStateValue } from '@shared/gameState'
import { useEffect } from 'react'

export const SessionController = () => {
	const dispatch = useAppDispatch()
	const api = useApi()
	const game = useGameState()
	const sessions = useAppStore((state) => state.client.sessions)

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
		dispatch(
			setClientState({
				sessions: {
					...sessions,
					[sessionKey]: {
						...sessions[sessionKey],
						name: game.name,
						generation: game.generation,
						finished: game.state === GameStateValue.Ended,
						lastUpdateAt: Date.now(),
					},
				},
			}),
		)
	}, [game])

	return <></>
}
