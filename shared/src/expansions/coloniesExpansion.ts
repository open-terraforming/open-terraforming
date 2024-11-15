import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { coloniesColonies } from '@shared/expansions/colonies/coloniesColonies'
import { shuffle } from '@shared/utils/shuffle'
import { coloniesCards } from './colonies/coloniesCards'
import { initialColonyState } from './colonies/states'
import { expansion, ExpansionType } from './types'

export const coloniesExpansion = expansion({
	type: ExpansionType.Colonies,
	name: 'Colonies',

	initialize(game) {
		const colonyCount =
			game.players.length <= 2
				? game.players.length + 3
				: game.players.length + 2

		game.colonies = shuffle(game.colonyCards.slice())
			.slice(0, colonyCount)
			.map((code) => initialColonyState(ColoniesLookupApi.get(code)))
	},

	getColonies: () => coloniesColonies,
	getCards: () => coloniesCards,
})
