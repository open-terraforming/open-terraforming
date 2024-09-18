import { CardSymbol } from '@shared/cards'
import { ColonyState, GameState, PlayerState } from '@shared/game'
import { getColonyTradeCost } from './getColonyTradeCost'

type Params = {
	player: PlayerState
	game: GameState
	colony: ColonyState
}

export const getColonyTradeCostSymbols = ({
	player,
	game,
	colony,
}: Params): CardSymbol[] => {
	const cost = getColonyTradeCost({ player, game, colony })

	return [
		{ resource: 'money', count: cost.money },
		{ resource: 'energy', count: cost.energy },
		{ resource: 'titan', count: cost.titan },
	]
}
