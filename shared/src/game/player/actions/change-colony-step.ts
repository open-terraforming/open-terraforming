import { colonizeColony } from '@shared/actions'
import { GameStateValue, PlayerStateValue } from '@shared/game'
import { PlayerActionType } from '@shared/player-actions'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof colonizeColony>['data']

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

		colony.step += pendingAction.data.change

		this.popAction()
	}
}
