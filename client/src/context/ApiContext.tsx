import { Client } from '@/api/api'
import { ApiState, setApiError, setApiState } from '@/store/modules/api'
import { setClientState } from '@/store/modules/client'
import { setGamePlayer, setGameState } from '@/store/modules/game'
import { useAppStore } from '@/utils/hooks'
import {
	GameStateValue,
	handshakeRequest,
	JoinError,
	joinRequest,
	MessageType,
	VERSION
} from '@shared/index'
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export const ApiContext = React.createContext<Client | null>(null)

export const ApiContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const dispatch = useDispatch()
	const session = useAppStore(state => state.client.session)
	const state = useAppStore(state => state.api.state)
	const gameId = useAppStore(state => state.api.gameId)
	const [reconnectCount, setReconnectCount] = useState(0)
	const [client, setClient] = useState(null as Client | null)

	useEffect(() => {
		if (state === ApiState.Connecting) {
			if (client) {
				client.disconnect()
			}

			if (gameId) {
				window.history.pushState(null, '', '#' + gameId)
			}

			setClient(
				new Client(
					'ws://' +
						(process.env.APP_API_URL || window.location.host) +
						(gameId ? '/game/' + gameId + '/socket' : '')
				)
			)
		}
	}, [state, gameId])

	if (client) {
		client.onOpen = () => {
			client.send(handshakeRequest(VERSION))
		}

		client.onClose = () => {
			if (reconnectCount < 5) {
				dispatch(
					setApiState({
						state: ApiState.Connecting
					})
				)

				setReconnectCount(reconnectCount + 1)

				setTimeout(() => {
					client.reconnect()
				}, 100 + reconnectCount * 300)
			} else {
				dispatch(
					setApiState({
						state: ApiState.Error
					})
				)
			}
		}

		client.onMessage = m => {
			switch (m.type) {
				case MessageType.HandshakeResponse: {
					const { error, state } = m.data

					if (error) {
						dispatch(
							setApiState({
								state: ApiState.Error,
								error
							})
						)
					} else {
						dispatch(
							setApiState({
								state: ApiState.Connected,
								error: undefined
							})
						)

						dispatch(
							setClientState({
								gameState: state
							})
						)

						if (state !== GameStateValue.WaitingForPlayers && session) {
							client.send(joinRequest(undefined, session))
						}
					}

					break
				}

				case MessageType.JoinResponse: {
					const { error, session, id } = m.data

					if (error === JoinError.InvalidSession) {
						localStorage['session'] = undefined

						dispatch(
							setClientState({
								session: undefined
							})
						)
					}

					if (error) {
						dispatch(
							setApiState({
								state: ApiState.Connected,
								error
							})
						)
					} else {
						localStorage['session'] = session
						dispatch(setGamePlayer(id as number))

						dispatch(
							setClientState({
								id,
								session
							})
						)

						dispatch(
							setApiState({
								state: ApiState.Joined,
								error: undefined
							})
						)
					}

					break
				}

				case MessageType.ServerMessage: {
					dispatch(setApiError(m.data.message))
					break
				}

				case MessageType.GameStateUpdate: {
					dispatch(setGameState(m.data))
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
