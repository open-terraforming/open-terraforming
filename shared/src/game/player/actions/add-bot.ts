import { GameStateValue, PlayerStateValue, addBot } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof addBot>['data']

export class AddBotAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Ready, PlayerStateValue.Waiting]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform() {
		if (this.game.state !== GameStateValue.WaitingForPlayers) {
			throw new Error('Game is already running')
		}

		if (!this.player.owner) {
			throw new Error('Only owner can start the game')
		}

		if (this.parent.game.bots.length >= this.parent.game.config.maxBots) {
			throw new Error('Maximum number of bots reached')
		}

		this.parent.game.addBot()
	}
}
