import { CardSpecial } from '@shared/cards/types'
import { Cards } from '@shared/cards/list'
import { coloniesColonies } from '@shared/expansions/colonies/coloniesColonies'
import { expansion, ExpansionType } from './types'

export const coloniesExpansion = expansion({
	type: ExpansionType.Colonies,
	name: 'Colonies',

	initialize(game) {
		game.colonyCards.push(...coloniesColonies.map((c) => c.code))
	},

	getCards: () => Cards.filter((c) => c.special.includes(CardSpecial.Colonies)),
})
