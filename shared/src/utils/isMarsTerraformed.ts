import { GameState } from '..'

export const isMarsTerraformed = (game: GameState) => {
	return (
		game.oceans >= game.map.oceans &&
		game.oxygen >= game.map.oxygen &&
		game.temperature >= game.map.temperature
	)
}
