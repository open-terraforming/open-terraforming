import { initialGameState, initialPlayerState } from '../states'
import { range } from '../utils'

export const prepareTestState = (players = 2) => {
	const game = initialGameState()
	range(0, players).forEach(i => {
		game.players.push(initialPlayerState(i + 1))
	})
	return game
}
