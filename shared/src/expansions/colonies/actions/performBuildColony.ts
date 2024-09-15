import { GameState, PlayerState } from '@shared/game'
import { isOk } from '@shared/utils'
import { ColoniesLookupApi } from '../ColoniesLookupApi'
import { canColonizeColony } from '../utils/canColonizeColony'

type Params = {
	game: GameState
	player: PlayerState
	colonyIndex: number
	forFree: boolean
	allowDuplicates: boolean
}

export const performBuildColony = ({
	game,
	player,
	colonyIndex,
	forFree,
	allowDuplicates,
}: Params) => {
	const colony = game.colonies[colonyIndex]

	const check = canColonizeColony({
		game: game,
		player: player,
		colony,
		forFree,
		allowDuplicates,
	})

	if (!isOk(check)) {
		throw new Error(check.error)
	}

	const colonyData = ColoniesLookupApi.get(colony.code)

	colony.playersAtSteps.push(player.id)

	if (colony.step < colony.playersAtSteps.length) {
		colony.step = colony.playersAtSteps.length
	}

	const colonizeBonus =
		colonyData.colonizeBonus[colony.playersAtSteps.length - 1]

	if (colonizeBonus) {
		colonizeBonus.perform({
			colony,
			game,
			player,
		})
	}

	player.money -= check.value.cost
}
