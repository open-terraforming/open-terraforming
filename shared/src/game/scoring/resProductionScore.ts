import { Resource } from '@shared/cards'
import { GameState } from '@shared/index'
import { AiScoringCoefficients } from './defaultScoringCoefficients'

export const resProductionScore = (
	s: AiScoringCoefficients,
	g: GameState,
	r: Resource,
) => {
	return {
		money: s.production.money,
		ore: s.production.ore,
		titan: s.production.titan,
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
