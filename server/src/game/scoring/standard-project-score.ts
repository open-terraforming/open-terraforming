import { StandardProjectType } from '@shared/index'
import { StandardProject } from '@shared/projects'
import { ScoringContext } from './types'
import { copyGame, computeScore, moneyCostScore } from './utils'

const baseScore = {
	[StandardProjectType.Aquifer]: 5,
	[StandardProjectType.City]: 5,
	[StandardProjectType.Greenery]: 8,
	[StandardProjectType.Asteroid]: 5,
	[StandardProjectType.PowerPlant]: 3,
	[StandardProjectType.SellPatents]: 0,
	[StandardProjectType.GreeneryForPlants]: 10,
	[StandardProjectType.TemperatureForHeat]: 10
}

export const standardProjectScore = (
	ctx: ScoringContext,
	project: StandardProject
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
