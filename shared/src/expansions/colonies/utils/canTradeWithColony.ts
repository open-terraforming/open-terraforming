import { ColonyState, GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '../../../utils'
import { failure } from '../../../utils/failure'
import { ok } from '../../../utils/ok'
import { OkOrFailure } from '../../../utils/okOrFailure'

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

	const playerIndex = getPlayerIndex(game, player.id)

	const usedFleets = game.colonies.filter(
		(c) => c.currentlyTradingPlayer === playerIndex,
	).length

	if (player.tradeFleets <= usedFleets) {
		return failure("You don't have any trade fleets left")
	}

	return ok()
}
