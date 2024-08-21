import { StandardProject } from '@shared/projects'
import { ScoringContext } from './types'
import { computeScore, copyGame, moneyCostScore } from './utils'

export const standardProjectScore = (
	ctx: ScoringContext,
	project: StandardProject,
) => {
	const { gameCopy, playerCopy } = copyGame(ctx.game, ctx.player)

	project.execute({ game: gameCopy, player: playerCopy }, [])

	return (
		computeScore(gameCopy, playerCopy) -
		(project.resource === 'money'
			? moneyCostScore(ctx.player, project.cost(ctx))
			: 0)
	)
}
