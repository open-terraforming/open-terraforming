import { GameStateValue, PlayerStateValue, startGame } from '@shared/index'
import { PlayerBaseActionHandler } from '../action'

type Args = ReturnType<typeof startGame>['data']

export class StartGameAction extends PlayerBaseActionHandler<Args> {
	states = [PlayerStateValue.Ready]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform() {
		if (!this.player.owner) {
			throw new Error('Only owner can start the game')
		}

		this.parent.game.sm.setState(GameStateValue.Starting)
	}
}
