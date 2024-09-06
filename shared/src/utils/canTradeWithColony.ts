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

export const canTradeWithColony = ({
	player,
	game,
	colony,
}: Params): OkOrFailure<{ cost: number }, string> => {
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
		return failure('Player has no trade fleets left')
	}

	const cost = 9

	if (player.money <= cost) {
		return failure('Player cannot afford to trade')
	}

	return ok({ cost })
}
