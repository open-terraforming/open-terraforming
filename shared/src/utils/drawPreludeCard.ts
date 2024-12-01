import { GameState } from '..'
import { shuffle } from './shuffle'

export const drawPreludeCard = (game: GameState) => {
	if (game.preludeCards.length === 0) {
		game.preludeCards = shuffle(game.preludeDiscarded.slice(0))
		game.preludeDiscarded = []
	}

	if (game.preludeCards.length === 0) {
		throw new Error(`There are no more prelude cards.`)
	}

	return game.preludeCards.pop() as string
}
