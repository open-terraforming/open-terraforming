import { effect } from './types'
import { CardResource, CardCategory, SymbolType } from '../types'

export const resourceAsPaymentForTags = (
	resource: CardResource,
	moneyValue: number,
	tags: CardCategory[],
) =>
	effect({
		description: `You can use ${resource} on this card as ${moneyValue}$ when paying for projects with ${tags
			.map((t) => CardCategory[t])
			.join(' or ')} tags`,
		symbols: [
			...(tags.length > 0
				? tags.map((t) => ({ tag: t }))
				: [{ tag: CardCategory.Any }]),
			{ symbol: SymbolType.Colon },
			{ cardResource: resource },
			{ symbol: SymbolType.Equal },
			{ resource: 'money', count: moneyValue },
		],
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		perform: () => {},
	})
