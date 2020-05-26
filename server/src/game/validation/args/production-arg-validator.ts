import { Resource } from '@shared/cards'
import { resourceProduction } from '@shared/cards/utils'
import { ValidatorContext } from './types'

export const productionArgValidator = ({
	a,
	value,
	ctx: { player }
}: ValidatorContext) => {
	if (typeof value !== 'number') {
		throw new Error(`${value} is not a number`)
	}

	if (player[resourceProduction[a.resource as Resource]] < value) {
		throw new Error(`Player doesn't ${value} production of ${a.resource}`)
	}
}
