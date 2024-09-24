import { Resource } from '@shared/cards'
import { GameState } from '@shared/index'
import { AiScoringCoefficients } from './defaultScoringCoefficients'

export const resScore = (
	s: AiScoringCoefficients,
	g: GameState,
	r: Resource,
) => {
	return {
		money: s.resources.money,
		ore: s.resources.ore,
		titan: s.resources.titan,
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
