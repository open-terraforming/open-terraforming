import React, { useMemo, useState, useContext } from 'react'
import { Client } from '@/api/api'
import { setApiError, setApiState } from '@/store/modules/api'
import {
	MessageType,
	handshakeRequest,
	VERSION,
	HandshakeError
} from '@shared/index'
import { setClientState } from '@/store/modules/client'
import { useDispatch } from 'react-redux'
import { setGameState, setGamePlayer } from '@/store/modules/game'
import { useAppStore } from '@/utils/hooks'

export const ApiContext = React.createContext<Client | null>(null)

export const ApiContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const dispatch = useDispatch()
	const session = useAppStore(state => state.client.session)
	const name = useAppStore(state => state.client.name)
	const [reconnectCount, setReconnectCount] = useState(0)

	const client = useMemo(() => {
		const client = new Client(process.env.APP_API_URL)

		return client
	}, [])

	client.onOpen = () => {
		dispatch(
			setApiState({
				connected: true,
				reconnecting: false,
				failed: false
			})
		)

		if (session) {
			client.send(handshakeRequest(VERSION, name, session))
		}
	}

	client.onClose = () => {
		if (reconnectCount < 5) {
			dispatch(
				setApiState({
					reconnecting: true,
					connected: false,
					failed: false
				})
			)

			setReconnectCount(reconnectCount + 1)

			setTimeout(() => {
				client.reconnect()
			}, 100 + reconnectCount * 300)
		} else {
			dispatch(
				setApiState({
					reconnecting: false,
					connected: false,
					failed: true
				})
			)
		}
	}

	client.onMessage = m => {
		switch (m.type) {
			case MessageType.HandshakeResponse: {
				const { error, session, id } = m.data

				if (error === HandshakeError.InvalidSession) {
					localStorage.removeItem('session')
					dispatch(setClientState({ session: undefined }))

					dispatch(
						setApiState({
							reconnecting: false
						})
					)
				}

				if (error) {
					dispatch(setApiError(error.toString()))

					dispatch(
						setClientState({
							initialized: false
						})
					)
				} else {
					localStorage['session'] = session
					dispatch(setGamePlayer(id as number))

					dispatch(
						setClientState({
							initialized: true,
							id,
							session
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

	return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>
}

export const useApi = () => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useContext(ApiContext)!
}
