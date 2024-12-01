import { GameState } from '..'
import { drawPreludeCard } from './drawPreludeCard'
import { range } from './range'

export const drawPreludeCards = (game: GameState, count: number) =>
	range(0, count).map(() => drawPreludeCard(game))
