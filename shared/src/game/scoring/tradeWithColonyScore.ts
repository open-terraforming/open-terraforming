import { performTradeWithColony } from '@shared/expansions/colonies/actions/performTradeWithColony'
import { canTradeWithColonyUsingResource } from '@shared/expansions/colonies/utils'
import { isFailure } from '@shared/utils'
import { ScoringContext } from './types'
import { computeScore, copyGame } from './utils'

export const tradeWithColonyScore = (
	ctx: ScoringContext,
	colonyIndex: number,
	resource: 'money' | 'energy' | 'titan',
) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	const colony = ctx.game.colonies[colonyIndex]

	const check = canTradeWithColonyUsingResource({
		player: ctx.player,
		game: ctx.game,
		colony,
		resource,
	})

	if (isFailure(check)) {
		return -1
	}

	performTradeWithColony({
		game: gameCopy,
		player: playerCopy,
		colonyIndex,
		cost: check.value.cost,
		costResource: check.value.resource,
	})

	return computeScore(gameCopy, playerCopy)
}
