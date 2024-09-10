import { GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '@shared/utils'

export const getPlayerUsedFleets = (game: GameState, player: PlayerState) => {
	const playerIndex = getPlayerIndex(game, player.id)

	return game.colonies.filter((c) => c.currentlyTradingPlayer === playerIndex)
}
