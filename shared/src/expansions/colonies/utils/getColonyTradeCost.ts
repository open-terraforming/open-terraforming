import { ColonyState, GameState, PlayerState } from '@shared/game'

type Params = {
	player: PlayerState
	game: GameState
	colony: ColonyState
}

export const getColonyTradeCost = ({ player }: Params) => {
	return {
		money: 9 + (player.colonyTradeMoneyCostChange ?? 0),
		energy: 3,
		titan: 3,
	}
}
