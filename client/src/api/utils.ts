import { API_URL } from '@/constants'

export const getWebsocketUrl = (postfix?: string) => {
	const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
	const basename = API_URL || window.location.host

	return (
		`${protocol}//` + `${basename}/api/ws/${postfix}`.replace(/\/{2,}/g, '/')
	)
}
