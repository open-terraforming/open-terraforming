import { GameState } from '../game'

export enum ExpansionType {
	Prelude = 1,
	VenusNext,
	Colonies
}

export interface Expansion {
	type: ExpansionType
	name: string

	getCards(game: GameState): string[]
}
