import { ColonyState, GameState, PlayerState } from '@shared/game'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
}

export const canAffordTradeWithColony = ({ player }: Params) => {
	return player.money >= 9
}
