import { ValidatorContext } from './types'
import { resources } from '@shared/cards/utils'
import { Resource } from '@shared/cards'

export const productionArgValidator = ({
	a,
	value,
	ctx: { game, player }
}: ValidatorContext) => {
	if (
		typeof value !== 'string' &&
		!resources.indexOf(value?.toString() as Resource)
	) {
		throw new Error(`${value} is not a resource`)
	}

	if (
		a.productionConditions.find(c => !c({ player, game }, value as Resource))
	) {
		throw new Error(`${value} is not a valid resource argument`)
	}
}
