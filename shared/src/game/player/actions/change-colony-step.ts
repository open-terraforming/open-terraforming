import { buildColony } from '@shared/actions'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseAction } from '../action'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'

type Args = ReturnType<typeof buildColony>['data']

export class ChangeColonyStep extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Playing]
	gameStates = [GameStateValue.GenerationInProgress]

	perform({ colonyIndex }: Args): void {
		const pendingAction = this.pendingAction

		if (pendingAction?.type !== PlayerActionType.ChangeColonyStep) {
			throw new Error('No pending ChangeColonyStep action')
		}

		const colony = this.game.colonies[colonyIndex]

		if (!colony) {
			throw new Error('Invalid colony')
		}

		const colonyInfo = ColoniesLookupApi.get(colony.code)
		const change = pendingAction.data.change

		if (change < 0 && colony.step === 0) {
			throw new Error('Colony step already at 0')
		}

		if (change > 0 && colony.step >= colonyInfo.tradeIncome.slots.length - 1) {
			throw new Error('Colony step already at max')
		}

		colony.step += change

		this.popAction()
	}
}
