import { CardsLookupApi } from '@shared/cards'
import { ValidatorContext } from './types'

export const cardResourceAmountArgValidator = ({
	a,
	value,
	ctx: { card }
}: ValidatorContext) => {
	if (typeof value !== 'number') {
		throw new Error(`${value} is not a number`)
	}

	if (value < (a.minAmount ?? 1)) {
		throw new Error(`Value must be at least ${a.minAmount}`)
	}

	const res = CardsLookupApi.get(card.code).resource

	if (!res) {
		throw new Error('Card has no resource - this is a bug')
	}

	if (card[res] < value) {
		throw new Error(`Card doesn't ${value} of ${res}`)
	}
}
