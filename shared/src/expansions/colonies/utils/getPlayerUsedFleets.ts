import { GameState, PlayerState } from '@shared/game'

export const getPlayerUsedFleets = (game: GameState, player: PlayerState) => {
	return game.colonies.filter((c) => c.currentlyTradingPlayer === player.id)
}
