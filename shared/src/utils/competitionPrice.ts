import { GameState } from '..'

export const competitionPrice = (game: GameState) => {
	return game.competitionsPrices[
		Math.min(game.competitionsPrices.length - 1, game.competitions.length)
	]
}
