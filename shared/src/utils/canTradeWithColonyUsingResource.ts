import { Resource } from '@shared/cards'
import { ColonyState, GameState, PlayerState } from '@shared/game'
import { assertNever } from './assertNever'
import { canTradeWithColony } from './canTradeWithColony'
import { failure } from './failure'
import { isFailure } from './isFailure'
import { ok } from './ok'
import { OkOrFailure } from './okOrFailure'

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

	switch (resource) {
		case 'money': {
			const cost = 9

			if (player.money <= cost) {
				return failure('Player cannot afford to trade')
			}

			return ok({ cost, resource })
		}

		case 'energy': {
			if (player.energy < 3) {
				return failure('Player has not enough energy')
			}

			return ok({ cost: 3, resource })
		}

		case 'titan': {
			if (player.titan < 3) {
				return failure('Player has not enough titan')
			}

			return ok({ cost: 3, resource })
		}
	}

	assertNever(resource)
}
