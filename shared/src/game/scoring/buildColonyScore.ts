import { performBuildColony } from '../../expansions/colonies/actions/performBuildColony'
import { ScoringContext } from './types'
import { computeScore, copyGame } from './utils'

export const buildColonyScore = (ctx: ScoringContext, colonyIndex: number) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	performBuildColony({
		game: gameCopy,
		player: playerCopy,
		colonyIndex,
		forFree: false,
		allowDuplicates: false,
	})

	return computeScore(gameCopy, playerCopy)
}
