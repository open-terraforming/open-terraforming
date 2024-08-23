import { expansion, ExpansionType } from './types'
import { Cards } from '../cards/list'
import { CardSpecial } from '../cards'

export const baseExpansion = expansion({
	type: ExpansionType.Base,
	name: 'Base game',

	getCards: () =>
		Cards.filter(
			(c) =>
				c.special.length === 0 ||
				c.special.includes(CardSpecial.CorporationsEra) ||
				c.special.includes(CardSpecial.StartingCorporation),
		),
})
