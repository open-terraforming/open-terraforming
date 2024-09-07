import { GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '@shared/utils'

type Params = {
	player: PlayerState
	game: GameState
}

export const getPlayerColoniesCount = ({ player, game }: Params) => {
	const playerIndex = getPlayerIndex(game, player.id)

	return game.colonies.reduce(
		(acc, c) => acc + c.playersAtSteps.filter((p) => p === playerIndex).length,
		0,
	)
}
