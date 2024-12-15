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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	project.execute({ game: gameCopy, player: playerCopy }, ...(args as any))

	const cost = project.cost({ game: gameCopy, player: playerCopy })

	playerCopy[project.resource] -= cost

	return computeScore(ctx.scoring, gameCopy, playerCopy)
}
