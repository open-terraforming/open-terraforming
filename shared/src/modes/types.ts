import { GameState } from '../game'
import { Card } from '../cards'

export enum GameModeType {
	Beginner = 1,
	Standard,
}

export interface GameMode {
	type: GameModeType
	name: string
	description: string

	onGameStart?: (game: GameState) => void
	filterCards?: (cards: Card[]) => Card[]
}
