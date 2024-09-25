import { GameState } from '@shared/index'

export const getMarsTerraformingRatio = (g: GameState) => {
	return (
		(g.oceans + g.oxygen + g.temperature) /
		(g.map.oceans + g.map.oxygen + g.map.temperature)
	)
}
