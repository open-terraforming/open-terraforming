import { emptyCardState } from '@shared/cards/utils'
import { ValidatorContext } from './types'

export const cardArgValidator = ({ a, ctx, value }: ValidatorContext) => {
	const selected = a.fromHand
		? emptyCardState(ctx.player.cards[value as number])
		: a.allowSelfCard && value === -1
			? ctx.card
			: ctx.player.usedCards[value as number]

	const errors = a.cardConditions.filter(
		(c) =>
			!c.evaluate({
				...ctx,
				card: selected,
			}),
	)

	if (errors.length > 0) {
		throw new Error(
			'Conditions not met: ' +
				errors.map((e, i) => e.description || i.toString()).join(', '),
		)
	}
}
