import { ServerInfo, GameInfo } from '@shared/extra'
import { GameModeType } from '@shared/modes/types'

const basePath = location.protocol + '//' + process.env.APP_API_URL

export const getServerInfo = (): Promise<ServerInfo> =>
	fetch(basePath + '/info').then(res => res.json())

export const getGames = (): Promise<GameInfo[]> =>
	fetch(basePath + '/games').then(res => res.json())

export const createGame = (
	name: string,
	mode: GameModeType,
	bots: number,
	isPublic: boolean
): Promise<GameInfo> =>
	fetch(basePath + '/games', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			mode,
			bots,
			public: isPublic
		})
	}).then(res => res.json())
