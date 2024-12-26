import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'

export const localGamesStore = {
	getGame(gameId: string) {
		const data = localStorage['ot-local-' + gameId]

		if (!data) {
			return null
		}

		return JSON.parse(data) as { state: GameState; config: GameConfig }
	},

	setGame(gameId: string, data: { state: GameState; config: GameConfig }) {
		localStorage['ot-local-' + gameId] = JSON.stringify(data)
	},
}
