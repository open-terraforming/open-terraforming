import { GameStateValue, pickColor, PlayerStateValue } from '@shared/index'
import { PlayerColors } from '@shared/player-colors'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof pickColor>['data']

export class PickColorAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Waiting]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform({ index }: Args) {
		if (index < -1 || index >= PlayerColors.length) {
			throw new Error('Unknown color')
		}

		this.player.color = index >= 0 ? PlayerColors[index] : ''
	}
}
