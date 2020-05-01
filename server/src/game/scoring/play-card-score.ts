import { Card } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'
import { ScoringContext } from './types'
import { getBestArgs, moneyCostScore } from './utils'

export const playCardScore = ({ player, game }: ScoringContext, card: Card) => {
	const cardState = emptyCardState(card.code)

	const best = getBestArgs(game, player, cardState, card.playEffects)

	return {
		score: best.score - moneyCostScore(player, card.cost),
		args: best.args
	}
}
