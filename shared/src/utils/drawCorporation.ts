import { GameState } from '..'
import { shuffle } from './shuffle'

export const drawCorporation = (game: GameState) => {
	if (game.corporations.length === 0) {
		game.corporations = shuffle(game.corporationsDiscarded.slice(0))
		game.corporationsDiscarded = []
	}

	if (game.corporations.length === 0) {
		throw new Error(`There are no more corporations to pick from`)
	}

	return game.corporations.pop() as string
}
