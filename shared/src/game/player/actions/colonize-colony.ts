import { colonizeColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { canColonizeColony, getPlayerIndex, isOk } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof colonizeColony>['data']

export class ColonizeColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]

		const check = canColonizeColony({
			game: this.game,
			player: this.player,
			colony,
		})

		if (!isOk(check)) {
			throw new Error(check.error)
		}

		const colonyData = ColoniesLookupApi.get(colony.code)

		colony.playersAtSteps.push(getPlayerIndex(this.game, this.player.id))

		if (colony.step < colony.playersAtSteps.length) {
			colony.step = colony.playersAtSteps.length
		}

		const colonizeBonus =
			colonyData.colonizeBonus[colony.playersAtSteps.length - 1]

		if (colonizeBonus) {
			colonizeBonus.perform({
				colony,
				game: this.game,
				player: this.player,
			})
		}

		this.player.money -= check.value.cost

		this.actionPlayed()
	}
}