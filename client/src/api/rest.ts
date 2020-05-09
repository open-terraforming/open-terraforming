import { ServerInfo, GameInfo } from '@shared/extra'
import { GameModeType } from '@shared/modes/types'
import { MapType } from '@shared/map'

const basePath =
	location.protocol + '//' + (process.env.APP_API_URL || location.host)

export const getServerInfo = (): Promise<ServerInfo> =>
	fetch(basePath + '/api/info').then(res => res.json())

export const getGames = (): Promise<GameInfo[]> =>
	fetch(basePath + '/api/games').then(res => res.json())

export const createGame = (
	name: string,
	mode: GameModeType,
	map: MapType,
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
			map,
			bots,
			public: isPublic
		})
	}).then(res => res.json())
