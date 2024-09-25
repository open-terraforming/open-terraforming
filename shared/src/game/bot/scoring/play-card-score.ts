import { Card } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { ScoringContext } from './types'
import { moneyCostScore } from './utils'
import { getBestArgs } from './getBestArgs'

export const playCardScore = (
	{ scoring, player, game }: ScoringContext,
	card: Card,
) => {
	const cardState = emptyCardState(card.code)

	// Add some resources to the card state so its effects can be evaluated properly
	// TODO: Is this good idea? Should this be configurable by coefficients?
	if (card.resource) {
		cardState[card.resource] = 6
	}

	try {
		const best = getBestArgs(scoring, game, player, cardState, card.playEffects)

		return {
			score: best.score - moneyCostScore(player, card.cost),
			args: best.args,
		}
	} catch {
		// TODO: Log this error
		return {
			score: 0,
			args: [],
		}
	}
}
