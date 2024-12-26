import { FrontendGameClient } from '@/api/api'
import { getWebsocketServer } from '@/api/utils'
import { ApiState, setApiError, setApiState } from '@/store/modules/api'
import { setClientState } from '@/store/modules/client'
import {
	setGameInfo,
	setGamePlayer,
	setGameState,
	setGameStateDiff,
} from '@/store/modules/game'
import { useAppStore } from '@/utils/hooks'
import { localGamesStore } from '@/utils/localGamesStore'
import { useRefCallback } from '@/utils/useRefCallback'
import {
	GameMessage,
	GameStateValue,
	handshakeRequest,
	JoinError,
	joinRequest,
	MessageType,
	VERSION,
} from '@shared/index'
import { DummyGameLockSystem } from '@shared/lib/dummy-game-lock-system'
import { LocalServer } from '@shared/localServer/LocalServer'
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

export const ApiContext = createContext<FrontendGameClient | null>(null)

export const ApiContextProvider = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch()
	const sessions = useAppStore((state) => state.client.sessions)
	const state = useAppStore((state) => state.api.state)
	const localGameConfig = useAppStore((state) => state.client.localGameConfig)
	const gameId = useAppStore((state) => state.api.gameId)
	const sessionKey = gameId || 'single'
	const isLocal = gameId?.startsWith('local/')

	const handleConnected = useRefCallback(() => {
		client.send(handshakeRequest(VERSION))
	})

	const handleDisconnected = useRefCallback(() => {
		dispatch(setApiState({ state: ApiState.Error, error: 'Disconnected' }))
	})

	const handleMessage = useRefCallback((m: GameMessage) => {
		console.log('Incoming', MessageType[m.type], m)

		switch (m.type) {
			case MessageType.HandshakeResponse: {
				const { error, info } = m.data

				if (error) {
					dispatch(
						setApiState({
							state: ApiState.Error,
							error,
						}),
					)
				} else {
					if (state !== ApiState.Joined) {
						dispatch(
							setApiState({
								state: ApiState.Connected,
								error: undefined,
							}),
						)
					}

					dispatch(
						setClientState({
							gameState: info?.state,
							info: info,
						}),
					)

					if (info) {
						dispatch(setGameInfo(info))
					}

					const session = sessions[sessionKey]

					if (info?.state !== GameStateValue.WaitingForPlayers) {
						if (session || isLocal) {
							client.send(joinRequest(undefined, session?.session))
						}
					}
				}

				break
			}

			case MessageType.JoinResponse: {
				const { error, session, id } = m.data

				if (error === JoinError.InvalidSession) {
					const newSessions = { ...sessions }
					delete newSessions[sessionKey]

					dispatch(
						setClientState({
							sessions: newSessions,
						}),
					)
				}

				if (error) {
					dispatch(
						setApiState({
							state: ApiState.Connected,
							error,
						}),
					)
				} else {
					dispatch(setGamePlayer(id as number, false))

					dispatch(
						setClientState({
							id,
							sessions: {
								...sessions,
								[sessionKey]: {
									session: session ?? '',
									name: '',
									generation: 0,
									finished: false,
									lastUpdateAt: Date.now(),
								},
							},
						}),
					)

					dispatch(
						setApiState({
							state: ApiState.Joined,
							error: undefined,
						}),
					)
				}

				break
			}

			case MessageType.SpectateResponse: {
				if (m.data.error) {
					dispatch(
						setApiState({
							state: ApiState.Connected,
							error: m.data.error,
						}),
					)
				} else {
					dispatch(setGamePlayer(-1, true))

					dispatch(
						setApiState({
							state: ApiState.Joined,
							error: undefined,
						}),
					)
				}

				break
			}

			case MessageType.ServerMessage: {
				dispatch(setApiError(m.data.message))
				break
			}

			case MessageType.GameStateFull: {
				dispatch(setGameState(m.data))

				break
			}

			case MessageType.GameStateUpdate: {
				dispatch(setGameStateDiff(m.data))
				break
			}

			case MessageType.Kicked: {
				location.hash = ''

				dispatch(
					setApiState({
						error: "You've been kicked",
						state: ApiState.Ready,
					}),
				)

				dispatch(
					setClientState({
						id: undefined,
					}),
				)

				break
			}
		}
	})

	const client = useMemo(() => {
		if (isLocal) {
			const client = new LocalServer(new DummyGameLockSystem(), localGameConfig)
			const localId = gameId?.split('/')[1]

			client.onMessage.on(handleMessage)

			client.onUpdate.on((s) => {
				if (localId) {
					localGamesStore.setGame(localId, {
						state: s,
						config: client.game.config,
					})
				}
			})

			const storedGame = localId && localGamesStore.getGame(localId)

			if (storedGame) {
				client.load(storedGame.state, storedGame.config)
			}

			setTimeout(() => handleConnected())

			return client
		}

		const client = new FrontendGameClient(getWebsocketServer())

		client.onConnected = handleConnected
		client.onDisconnected = handleDisconnected
		client.onMessage = handleMessage

		return client
	}, [isLocal, handleConnected, handleDisconnected, handleMessage])

	useEffect(() => {
		client.connect(gameId)
	}, [gameId])

	useEffect(() => {
		return () => {
			client.dispose()
		}
	}, [client])

	return (
		<ApiContext.Provider value={client as FrontendGameClient}>
			{children}
		</ApiContext.Provider>
	)
}

export const useApi = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useContext(ApiContext)!
}
