import { ColonyState, GameState, PlayerState } from '@shared/gameState'
import { failure } from '../../../utils/failure'
import { ok } from '../../../utils/ok'
import { OkOrFailure } from '../../../utils/okOrFailure'
import { getPlayerUsedFleets } from './getPlayerUsedFleets'
import { ColoniesLookupApi } from '../ColoniesLookupApi'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
}

export const canTradeWithColony = ({
	player,
	game,
	colony,
}: Params): OkOrFailure<never, string> => {
	if (!colony.active) {
		return failure(
			'Colony is not active, you have to first play a card that accepts its resources',
		)
	}

	const info = ColoniesLookupApi.get(colony.code)

	if (
		info.tradeIncome.condition &&
		!info.tradeIncome.condition({ colony, game, player })
	) {
		return failure('Cannot trade with this colony')
	}

	if (typeof colony.currentlyTradingPlayer === 'number') {
		return failure('Colony is already trading')
	}

	const usedFleets = getPlayerUsedFleets(game, player).length

	if (player.tradeFleets <= usedFleets) {
		return failure("You don't have any trade fleets left")
	}

	return ok()
}
