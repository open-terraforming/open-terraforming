import { GameState } from '../gameState'
import { WithOptional, Card } from '../cards'

export enum ExpansionType {
	Base = 1,
	Prelude,
	Venus,
	Colonies,
	Turmoil,
}

export interface Expansion {
	type: ExpansionType
	name: string

	initialize(game: GameState): void
	getCards(game: GameState): Card[]
}

export const expansion = (
	e: WithOptional<Expansion, 'initialize' | 'getCards'>,
): Expansion => ({
	initialize: () => null,
	getCards: () => [],
	...e,
})
