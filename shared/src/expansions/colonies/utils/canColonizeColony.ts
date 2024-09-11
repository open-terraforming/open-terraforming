import { ColonyState, GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '../../../utils'
import { OkOrFailure } from '../../../utils/okOrFailure'
import { ok } from '../../../utils/ok'
import { failure } from '../../../utils/failure'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
	forFree?: boolean
	allowDuplicates?: boolean
}

export const canColonizeColony = ({
	player,
	game,
	colony,
	forFree,
	allowDuplicates,
}: Params): OkOrFailure<{ cost: number }, string> => {
	if (!colony.active) {
		return failure('Colony is not active')
	}

	if (colony.playersAtSteps.length >= 3) {
		return failure('Colony is already full')
	}

	const playerIndex = getPlayerIndex(game, player.id)

	if (!allowDuplicates && colony.playersAtSteps.includes(playerIndex)) {
		return failure('You already have a colony here')
	}

	if (forFree) {
		return ok({ cost: 0 })
	}

	const cost = 17

	if (player.money <= cost) {
		return failure('You cannot afford to colonize')
	}

	return ok({ cost })
}