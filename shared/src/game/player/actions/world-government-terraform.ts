import {
	EventType,
	GameStateValue,
	GridCellContent,
	PlayerStateValue,
	worldGovernmentTerraform,
} from '@shared/index'
import { placeTileAction, PlayerActionType } from '@shared/player-actions'
import { f, pushPendingAction } from '@shared/utils'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof worldGovernmentTerraform>['data']

export class WorldGovernmentTerraform extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.WorldGovernmentTerraform]
	gameStates = [GameStateValue.SolarPhase]

	perform({ progress }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.WorldGovernmentTerraform) {
			throw new Error('Top action is not world government terraform')
		}

		if (
			progress !== 'temperature' &&
			progress !== 'oxygen' &&
			progress !== 'oceans' &&
			progress !== 'venus'
		) {
			throw new Error(
				'Invalid progress, only global mars terraforming is allowed',
			)
		}

		const currentProgress = this.game[progress]
		const maxProgress = this.game.map[progress]

		if (currentProgress >= maxProgress) {
			throw new Error('Already maxed out')
		}

		if (progress === 'oceans') {
			pushPendingAction(
				this.player,
				placeTileAction({ type: GridCellContent.Ocean }, true),
			)
		} else {
			this.game[progress]++
		}

		this.logger.log(f('Increased {0}', progress))

		this.popAction()

		this.pushEvent({
			type: EventType.WorldGovernmentTerraforming,
			progress,
			playerId: this.player.id,
		})
	}
}
