import { GameStateValue, PlayerStateValue, kickPlayer } from '@shared/index'
import { PlayerBaseAction } from '../action'

type Args = ReturnType<typeof kickPlayer>['data']

export class KickPlayerAction extends PlayerBaseAction<Args> {
	states = [PlayerStateValue.Ready, PlayerStateValue.Waiting]
	gameStates = [GameStateValue.WaitingForPlayers]

	perform({ playerId }: Args) {
		if (this.game.state !== GameStateValue.WaitingForPlayers) {
			throw new Error('Game is already running')
		}

		if (!this.player.owner) {
			throw new Error('Only owner can start the game')
		}

		const player = this.parent.game.players.find((p) => p.id === playerId)

		if (!player) {
			throw new Error(`Unknown player ${playerId}`)
		}

		this.parent.game.onPlayerKicked.emit(player)
		this.parent.game.remove(player)
	}
}
