import { Resource } from '@shared/cards'
import { GameState, PlayerState } from '@shared/gameState'
import { getPlayerById } from '@shared/utils/getPlayerById'
import { ColoniesLookupApi } from '../../../ColoniesLookupApi'

type Params = {
	game: GameState
	player: PlayerState
	colonyIndex: number
	cost: number
	costResource: Resource
}

export const performTradeWithColony = ({
	game,
	player,
	colonyIndex,
	cost,
	costResource,
}: Params) => {
	if (
		costResource !== 'energy' &&
		costResource !== 'money' &&
		costResource !== 'titan'
	) {
		throw new Error('Invalid resource')
	}

	const colony = game.colonies[colonyIndex]
	const colonyData = ColoniesLookupApi.get(colony.code)

	for (const colonyOfPlayerId of colony.playersAtSteps) {
		colonyData.incomeBonus.perform({
			colony,
			game,
			player: getPlayerById(game, colonyOfPlayerId),
		})
	}

	colonyData.tradeIncome.perform({
		colony,
		game,
		player,
	})

	colony.currentlyTradingPlayer = player.id
	// Returns the colony indicator to the left
	colony.step = Math.max(0, colony.playersAtSteps.length)

	player[costResource] -= cost
}
