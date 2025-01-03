import { PlayerBaseActionHandler } from '../action'
import { PlayerStateValue, GameStateValue, playerReady } from '@shared/index'

type ToggleReadyArgs = ReturnType<typeof playerReady>['data']

export class ToggleReadyAction extends PlayerBaseActionHandler<ToggleReadyArgs> {
	states = [PlayerStateValue.Waiting, PlayerStateValue.Ready]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform({ ready }: ToggleReadyArgs) {
		this.setState(ready ? PlayerStateValue.Ready : PlayerStateValue.Waiting)
	}
}
