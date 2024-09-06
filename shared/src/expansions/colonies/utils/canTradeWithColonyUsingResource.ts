import { Resource } from '@shared/cards'
import { ColonyState, GameState, PlayerState } from '@shared/game'
import { failure } from '../../../utils/failure'
import { isFailure } from '../../../utils/isFailure'
import { ok } from '../../../utils/ok'
import { OkOrFailure } from '../../../utils/okOrFailure'
import { canTradeWithColony } from './canTradeWithColony'
import { getColonyTradeCost } from './getColonyTradeCost'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
	resource: 'money' | 'energy' | 'titan'
}

export const canTradeWithColonyUsingResource = ({
	player,
	game,
	colony,
	resource,
}: Params): OkOrFailure<{ cost: number; resource: Resource }, string> => {
	const check = canTradeWithColony({ player, game, colony })

	if (isFailure(check)) {
		return failure(check.error)
	}

	const cost = getColonyTradeCost({ player, game, colony })

	if (!(resource in cost)) {
		return failure('Invalid resource')
	}

	if (player[resource] < cost[resource]) {
		return failure('Player has not enough resources')
	}

	return ok({ cost: cost[resource], resource })
}
