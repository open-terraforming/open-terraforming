import { colonizeColony } from '@shared/actions'
import { ColoniesLookupApi } from '@shared/colonies/ColoniesLookupApi'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { getPlayerIndex } from '@shared/utils'
import { PlayerBaseAction } from '../action'
import { canAffordColonize } from '@shared/utils/canAffordColonize'

type Args = ReturnType<typeof colonizeColony>['data']

export class ColonizeColonyAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const colony = this.game.colonies[colonyIndex]

		if (!colony.active) {
			throw new Error('Colony is not active')
		}

		if (colony.playersAtSteps.length >= 3) {
			throw new Error('Colony already full')
		}

		if (!canAffordColonize({ player: this.player, game: this.game, colony })) {
			throw new Error('Player cannot afford to colonize')
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

		this.actionPlayed()
	}
}
