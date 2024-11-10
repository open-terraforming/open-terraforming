import { CardSymbol } from '@shared/cards'
import { GameState } from '@shared/index'

export interface GlobalEvent {
	code: string
	/** code of committee party that will receive neutral delegate when the event is revealed */
	initialDelegate: string
	/** code of committee party that will receive neutral delegate when the event is moved to current */
	effectDelegate: string

	effects: {
		symbols: CardSymbol[]
		description: string
		apply: (game: GameState) => void
	}[]
}

export const globalEvent = (e: GlobalEvent) => e
