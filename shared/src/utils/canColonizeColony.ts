import { ColonyState, GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '.'
import { OkOrFailure } from './okOrFailure'
import { ok } from './ok'
import { failure } from './failure'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
}

export const canColonizeColony = ({
	player,
	game,
	colony,
}: Params): OkOrFailure<{ cost: number }, string> => {
	if (!colony.active) {
		return failure('Colony is not active')
	}

	if (colony.playersAtSteps.length >= 3) {
		return failure('Colony already full')
	}

	const playerIndex = getPlayerIndex(game, player.id)

	// TODO: There will be exceptions to this
	if (colony.playersAtSteps.includes(playerIndex)) {
		return failure('Player already has a colony here')
	}

	const cost = 17

	if (player.money <= cost) {
		return failure('Player cannot afford to colonize')
	}

	return ok({ cost })
}
