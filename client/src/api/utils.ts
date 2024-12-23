import { API_URL } from '@/constants'

export const getWebsocketServer = () => {
	const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
	const basename = API_URL || window.location.host

	return `${protocol}//${basename}`
}
