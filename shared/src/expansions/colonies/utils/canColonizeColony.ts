import { ColonyState, GameState, PlayerState } from '@shared/gameState'
import { failure } from '../../../utils/failure'
import { ok } from '../../../utils/ok'
import { OkOrFailure } from '../../../utils/okOrFailure'
import { ColoniesLookupApi } from '../ColoniesLookupApi'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
	forFree?: boolean
	allowDuplicates?: boolean
}

export const canBuildColony = ({
	player,
	game,
	colony,
	forFree,
	allowDuplicates,
}: Params): OkOrFailure<{ cost: number }, string> => {
	if (!colony.active) {
		return failure(
			'Colony is not active, you have to first play a card that accepts its resources',
		)
	}

	const info = ColoniesLookupApi.get(colony.code)

	if (colony.playersAtSteps.length >= 3) {
		return failure('Colony is already full')
	}

	const colonizeBonus = info.colonizeBonus[colony.playersAtSteps.length]

	if (
		colonizeBonus?.condition &&
		!colonizeBonus.condition({
			colony,
			game,
			player,
		})
	) {
		return failure('Cannot build colony')
	}

	if (!allowDuplicates && colony.playersAtSteps.includes(player.id)) {
		return failure('You already have a colony here')
	}

	if (forFree) {
		return ok({ cost: 0 })
	}

	const cost = 17

	if (player.money < cost) {
		return failure('You cannot afford to colonize')
	}

	return ok({ cost })
}
