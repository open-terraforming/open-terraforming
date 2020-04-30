import { ScoringContext } from './types'
import { Card, CardEffect, CardCallbackContext } from '@shared/cards'
import { emptyCardState } from '@shared/cards/utils'

const evScore = (s: CardEffect['aiScore'], ctx: CardCallbackContext) =>
	typeof s === 'number' ? s : s(ctx)

export const playCardScore = ({ player, game }: ScoringContext, card: Card) => {
	return card.playEffects.reduce(
		(acc, e) =>
			acc +
			evScore(e.aiScore, {
				player,
				game,
				playerId: player.id,
				card: emptyCardState(card.code),
				cardIndex: -1
			}),
		0
	)
}
