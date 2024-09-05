import { ColonyState, GameState, PlayerState } from '@shared/game'
import { getPlayerIndex } from '.'
import { OkOrFail } from './okOrFail'
import { ok } from './ok'
import { fail } from './fail'

type Params = {
	game: GameState
	player: PlayerState
	colony: ColonyState
}

export const canTradeWithColony = ({
	player,
	game,
	colony,
}: Params): OkOrFail<{ cost: number }, string> => {
	if (!colony.active) {
		return fail('Colony is not active')
	}

	if (typeof colony.currentlyTradingPlayer === 'number') {
		return fail('Colony is already trading')
	}

	const playerIndex = getPlayerIndex(game, player.id)

	const usedFleets = game.colonies.filter(
		(c) => c.currentlyTradingPlayer === playerIndex,
	).length

	if (player.tradeFleets <= usedFleets) {
		return fail('Player has no trade fleets left')
	}

	const cost = 9

	if (player.money <= cost) {
		return fail('Player cannot afford to trade')
	}

	return ok({ cost })
}
