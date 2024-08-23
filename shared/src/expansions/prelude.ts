import { expansion, ExpansionType } from './types'
import { CardSpecial, CardsLookupApi, CardType } from '../cards'
import { shuffle } from '../utils'

export const preludeExpansion = expansion({
	type: ExpansionType.Prelude,
	name: 'Prelude',

	initialize: (g) => {
		g.prelude = true

		g.preludeCards = shuffle(
			Object.values(CardsLookupApi.data())
				.filter((c) => c.type === CardType.Prelude)
				.map((c) => c.code),
		)
	},
	getCards: () =>
		Object.values(CardsLookupApi.data()).filter((c) =>
			c.special.includes(CardSpecial.Prelude),
		),
})
