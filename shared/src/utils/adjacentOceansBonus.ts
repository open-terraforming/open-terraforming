import { GameState, PlayerState } from '..'

export const adjacentOceansBonus = (game: GameState, player: PlayerState) =>
	player.adjacentOceansBonus ?? 2
