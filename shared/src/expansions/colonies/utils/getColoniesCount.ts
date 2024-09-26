import { GameState } from '@shared/gameState'

type Params = {
	game: GameState
}

export const getColoniesCount = ({ game }: Params) => {
	return game.colonies.reduce((acc, c) => acc + c.playersAtSteps.length, 0)
}
