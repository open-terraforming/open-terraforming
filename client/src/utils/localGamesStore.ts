import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'
import { stripUndefined } from '@shared/utils'
import { decode, encode } from 'msgpack-lite'

const LOCAL_GAMES_PREFIX = 'ot-local-'

export const extractGameIdFromLocal = (gameId: string) => gameId.split('/')[1]

// TODO: Handle local storage file size limits somehow

export const localGamesStore = {
	getGame(gameId: string) {
		const data = localStorage[LOCAL_GAMES_PREFIX + gameId]

		if (!data) {
			return null
		}

		return decode(data) as { state: GameState; config: GameConfig }
	},

	setGame(gameId: string, data: { state: GameState; config: GameConfig }) {
		localStorage[LOCAL_GAMES_PREFIX + gameId] = encode(stripUndefined(data))
	},

	removeGame(gameId: string) {
		delete localStorage[LOCAL_GAMES_PREFIX + gameId]
	},
}
