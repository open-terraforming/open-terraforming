import { Client } from '@/api/api'
import { getWebsocketUrl } from '@/api/utils'
import { ApiState, setApiError, setApiState } from '@/store/modules/api'
import { setClientState } from '@/store/modules/client'
import {
	setGameInfo,
	setGamePlayer,
	setGameState,
	setGameStateDiff,
} from '@/store/modules/game'
import { useAppStore } from '@/utils/hooks'
import {
	GameStateValue,
	handshakeRequest,
	JoinError,
	joinRequest,
	MessageType,
	VERSION,
} from '@shared/index'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useDispatch } from 'react-redux'

export const ApiContext = createContext<Client | null>(null)

export const ApiContextProvider = ({ children }: { children: ReactNode }) => {
	const dispatch = useDispatch()
	const sessions = useAppStore((state) => state.client.sessions)
	const state = useAppStore((state) => state.api.state)
	const gameId = useAppStore((state) => state.api.gameId)
	const sessionKey = gameId || 'single'
	const [reconnectCount, setReconnectCount] = useState(0)
	const [client, setClient] = useState(null as Client | null)

	useEffect(() => {
		if (state === ApiState.Ready) {
			if (client) {
				client.onClose = undefined
				client.onOpen = undefined
				client.disconnect()

				setClient(null)
			}
		}

		if (state === ApiState.Connecting && gameId) {
			if (!client || client.gameId !== gameId) {
				if (client) {
					client.onClose = undefined
					client.onOpen = undefined
					client.disconnect()
				}

				setClient(
					new Client(
						getWebsocketUrl(gameId ? `game/${gameId}/socket` : ''),
						gameId,
					),
				)
			}
		}
	}, [state, gameId])

	if (client) {
		client.onOpen = () => {
			setReconnectCount(0)
			client.send(handshakeRequest(VERSION))
		}

		client.onClose = () => {
			if (reconnectCount < 5) {
				dispatch(setApiState({ reconnecting: true }))

				setReconnectCount(reconnectCount + 1)

				setTimeout(
					() => {
						client.reconnect()
					},
					1 + reconnectCount * 300,
				)
			} else {
				dispatch(
					setApiState({
						state: ApiState.Error,
					}),
				)
			}
		}

		client.onMessage = (m) => {
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
						dispatch(
							setApiState({
								state: ApiState.Connected,
								error: undefined,
							}),
						)

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
							if (session) {
								client.send(joinRequest(undefined, session.session))
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
		}
	}

	return (
		<ApiContext.Provider value={client as Client}>
			{children}
		</ApiContext.Provider>
	)
}

export const useApi = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useContext(ApiContext)!
}
