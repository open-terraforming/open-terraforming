import { expansion, ExpansionType } from './types'

export const coloniesExpansion = expansion({
	type: ExpansionType.Colonies,
	name: 'Colonies',

	initialize() {},
	getCards: () => [],
})
