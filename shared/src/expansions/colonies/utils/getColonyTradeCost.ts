import { ColonyState, GameState, PlayerState } from '@shared/game'

type Params = {
	player: PlayerState
	game: GameState
	colony: ColonyState
}

export const getColonyTradeCost = ({ player }: Params) => {
	return {
		money: 9 + (player.colonyTradeResourceCostChange ?? 0),
		energy: 3 + (player.colonyTradeResourceCostChange ?? 0),
		titan: 3 + (player.colonyTradeResourceCostChange ?? 0),
	}
}
