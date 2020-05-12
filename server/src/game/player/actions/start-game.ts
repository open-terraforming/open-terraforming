import { GameStateValue, PlayerStateValue } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = {} // ReturnType<typeof startGame>['data']

export class StartGameAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Ready]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform() {
		if (!this.player.owner) {
			throw new Error('Only owner can start the game')
		}

		this.parent.game.sm.setState(GameStateValue.Starting)
	}
}
