import { GameState, PlayerState } from '@shared/gameState'

export const getPlayerUsedFleets = (game: GameState, player: PlayerState) => {
	return game.colonies.filter((c) => c.currentlyTradingPlayer === player.id)
}
