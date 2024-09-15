import { GameState } from '@shared/game'

export const getPlayerById = (game: GameState, playerId: number) => {
	const player = game.players.find((p) => p.id === playerId)

	if (!player) {
		throw new Error(`Player with id ${playerId} not found`)
	}

	return player
}
