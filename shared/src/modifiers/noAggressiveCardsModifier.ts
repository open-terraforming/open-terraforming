import { ModifierType } from './types'
import { modifier } from './utils'

// TODO: Add cards that somehow directly hurt other players
const AGGRESSIVE_CARDS = new Set([''])

export const noAggressiveCardsModifier = modifier({
	type: ModifierType.NoAggressiveCard,
	apply: (game) => {
		game.cards = game.cards.filter((c) => !AGGRESSIVE_CARDS.has(c))
	},
})
