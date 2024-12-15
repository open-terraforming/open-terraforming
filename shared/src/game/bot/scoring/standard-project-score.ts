import { AnyStandardProject, StandardProjectArgValue } from '@shared/projects'
import { computeScore } from './computeScore'
import { ScoringContext } from './types'
import { copyGame } from './utils'

export const standardProjectScore = (
	ctx: ScoringContext,
	project: AnyStandardProject,
	args: StandardProjectArgValue[],
) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	project.execute({ game: gameCopy, player: playerCopy }, ...args)

	const cost = project.cost({ game: gameCopy, player: playerCopy })

	playerCopy[project.resource] -= cost

	return computeScore(ctx.scoring, gameCopy, playerCopy)
}
