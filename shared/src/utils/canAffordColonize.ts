import { ColonyState, GameState, PlayerState } from '@shared/game'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
}

export const canAffordColonize = ({ player }: Params) => {
	return player.money >= 17
}
