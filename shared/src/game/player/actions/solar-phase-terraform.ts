import {
	EventType,
	GameStateValue,
	GridCellContent,
	PlayerStateValue,
	solarPhaseTerraform,
} from '@shared/index'
import { placeTileAction, PlayerActionType } from '@shared/player-actions'
import { f } from '@shared/utils/f'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof solarPhaseTerraform>['data']

export class SolarPhaseTerraform extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.SolarPhaseTerraform]
	gameStates = [GameStateValue.SolarPhase]

	perform({ progress }: Args) {
		const top = this.pendingAction

		if (top?.type !== PlayerActionType.SolarPhaseTerraform) {
			throw new Error('Top action is not solar phase terraform')
		}

		if (
			progress !== 'temperature' &&
			progress !== 'oxygen' &&
			progress !== 'oceans'
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
				placeTileAction(
					{
						type: GridCellContent.Ocean,
					},
					true,
				),
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
