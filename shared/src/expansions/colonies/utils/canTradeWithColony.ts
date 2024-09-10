import { ColonyState, GameState, PlayerState } from '@shared/game'
import { failure } from '../../../utils/failure'
import { ok } from '../../../utils/ok'
import { OkOrFailure } from '../../../utils/okOrFailure'
import { getPlayerUsedFleets } from './getPlayerUsedFleets'

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
		return failure('Colony is not active')
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
