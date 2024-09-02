import { baseColonies } from '@shared/colonies/baseColonies'
import { expansion, ExpansionType } from './types'

export const coloniesExpansion = expansion({
	type: ExpansionType.Colonies,
	name: 'Colonies',

	initialize(game) {
		game.colonyCards.push(...baseColonies.map((c) => c.code))
	},

	getCards: () => [],
})
