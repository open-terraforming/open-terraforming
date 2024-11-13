import { GameState } from '../gameState'
import { WithOptional, Card } from '../cards'
import { GlobalEvent } from './turmoil/turmoilGlobalEvent'
import { CommitteeParty } from './turmoil/committeeParty'

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
	getGlobalEvents(game: GameState): GlobalEvent[]
	getCommitteeParties(game: GameState): CommitteeParty[]
}

export const expansion = (
	e: WithOptional<
		Expansion,
		'initialize' | 'getCards' | 'getCommitteeParties' | 'getGlobalEvents'
	>,
): Expansion => ({
	initialize: () => null,
	getCards: () => [],
	getCommitteeParties: () => [],
	getGlobalEvents: () => [],
	...e,
})
