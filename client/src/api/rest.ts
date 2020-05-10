import { GameInfo, ServerInfo } from '@shared/extra'
import { NewGameRequest } from '@shared/requests'

const basePath =
	location.protocol + '//' + (process.env.APP_API_URL || location.host)

export const getServerInfo = (): Promise<ServerInfo> =>
	fetch(basePath + '/api/info').then(res => res.json())

export const getGames = (): Promise<GameInfo[]> =>
	fetch(basePath + '/api/games').then(res => res.json())

export const createGame = (options: NewGameRequest): Promise<GameInfo> =>
	fetch(basePath + '/api/games', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(options)
	}).then(res => res.json())
