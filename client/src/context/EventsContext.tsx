import { EventsClient } from '@/api/events'
import { ApiState } from '@/store/modules/api'
import { useAppStore } from '@/utils/hooks'
import { eventsAuth } from '@shared/events'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { getWebsocketUrl } from '@/api/utils'

export const EventsContext = createContext<EventsClient | null>(null)

export const EventsContextProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const sessions = useAppStore((state) => state.client.sessions)
	const apiState = useAppStore((state) => state.api.state)
	const gameId = useAppStore((state) => state.api.gameId)
	const sessionKey = gameId || 'single'
	const [client, setClient] = useState(null as EventsClient | null)

	useEffect(() => {
		if (apiState !== ApiState.Joined && client) {
			client.onClose = undefined
			client.onOpen = undefined
			client.disconnect()
		}

		if (apiState === ApiState.Joined && !client) {
			setClient(
				new EventsClient(
					getWebsocketUrl(gameId ? `game/${gameId}/events` : ''),
				),
			)
		}
	}, [apiState, gameId])

	if (client) {
		client.onOpen = () => {
			client.send(eventsAuth(sessions[sessionKey] as string))
		}

		client.onClose = () => {
			setTimeout(() => {
				client.reconnect()
			}, 5 * 1000)
		}
	}

	return (
		<EventsContext.Provider value={client as EventsClient}>
			{children}
		</EventsContext.Provider>
	)
}

export const useEvents = () => {
	return useContext(EventsContext)
}
