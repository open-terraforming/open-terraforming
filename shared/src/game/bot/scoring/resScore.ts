import { Resource } from '@shared/cards'
import { GameState } from '@shared/index'
import { isMarsTerraformed } from '@shared/utils'
import { AiScoringCoefficients } from './defaultScoringCoefficients'

export const resScore = (
	s: AiScoringCoefficients,
	g: GameState,
	r: Resource,
) => {
	const isTerraformed = isMarsTerraformed(g)

	return {
		money: isTerraformed ? 0 : s.resources.money,
		ore: isTerraformed ? 0 : s.resources.ore,
		titan: isTerraformed ? 0 : s.resources.titan,
		plants: s.resources.plants,
		heat:
			g.temperature < g.map.temperature
				? s.resources.heatWhenBelowGlobalTemperature
				: s.resources.heatWhenAboveGlobalTemperature,
		energy:
			g.temperature < g.map.temperature
				? s.resources.energyWhenBelowGlobalTemperature
				: s.resources.energyWhenBelowGlobalTemperature,
	}[r]
}
