import { ScoringContext } from './types'
import { StandardProject } from '@shared/projects'
import { StandardProjectType } from '@shared/index'

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
	if (project.resource !== 'money') {
		return 10
	}

	let score = baseScore[project.type] ?? 0

	score -=
		Math.max(0, project.cost(ctx) / ctx.player[project.resource] - 0.2) * 2

	return score
}
