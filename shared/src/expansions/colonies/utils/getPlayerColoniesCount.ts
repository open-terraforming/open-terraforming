import { GameState, PlayerState } from '@shared/game'

type Params = {
	player: PlayerState
	game: GameState
}

export const getPlayerColoniesCount = ({ player, game }: Params) => {
	return game.colonies.reduce(
		(acc, c) => acc + c.playersAtSteps.filter((p) => p === player.id).length,
		0,
	)
}
