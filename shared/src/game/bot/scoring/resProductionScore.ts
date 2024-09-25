import { Resource } from '@shared/cards'
import { GameState } from '@shared/index'
import { isMarsTerraformed } from '@shared/utils'
import { AiScoringCoefficients } from './defaultScoringCoefficients'
import { getMarsTerraformingRatio } from './getMarsTerraformingRatio'

export const resProductionScore = (
	s: AiScoringCoefficients,
	g: GameState,
	r: Resource,
) => {
	const isTerraformed = isMarsTerraformed(g)
	const terraformingRatio = getMarsTerraformingRatio(g)
	const productionRatio = 1 - terraformingRatio * 0.2

	return {
		money: isTerraformed ? 0 : productionRatio * s.production.money,
		ore: isTerraformed ? 0 : productionRatio * s.production.ore,
		titan: isTerraformed ? 0 : productionRatio * s.production.titan,
		plants: s.production.plants,
		heat:
			g.temperature < g.map.temperature
				? s.production.heatWhenBelowGlobalTemperature
				: s.production.heatWhenAboveGlobalTemperature,
		energy:
			g.temperature < g.map.temperature
				? s.production.energyWhenBelowGlobalTemperature
				: s.production.energyWhenBelowGlobalTemperature,
	}[r]
}
