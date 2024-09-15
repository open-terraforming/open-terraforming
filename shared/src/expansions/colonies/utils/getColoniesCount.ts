import { GameState } from '@shared/game'

type Params = {
	game: GameState
}

export const getColoniesCount = ({ game }: Params) => {
	return game.colonies.reduce((acc, c) => acc + c.playersAtSteps.length, 0)
}
