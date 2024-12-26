import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'

const LOCAL_GAMES_PREFIX = 'ot-local-'

export const extractGameIdFromLocal = (gameId: string) => gameId.split('/')[1]

export const localGamesStore = {
	getGame(gameId: string) {
		const data = localStorage[LOCAL_GAMES_PREFIX + gameId]

		if (!data) {
			return null
		}

		return JSON.parse(data) as { state: GameState; config: GameConfig }
	},

	setGame(gameId: string, data: { state: GameState; config: GameConfig }) {
		localStorage[LOCAL_GAMES_PREFIX + gameId] = JSON.stringify(data)
	},

	removeGame(gameId: string) {
		delete localStorage[LOCAL_GAMES_PREFIX + gameId]
	},
}
