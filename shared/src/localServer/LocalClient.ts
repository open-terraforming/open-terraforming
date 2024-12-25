import { Player } from '@shared/game/player'
import { ConsoleLogger } from './ConsoleLogger'
import { LocalServer } from './LocalServer'
import { PlayerStateValue } from '../gameState'

export class LocalClient {
	logger = new ConsoleLogger('GameClient')

	server: LocalServer
	player: Player

	constructor(server: LocalServer) {
		this.server = server
		this.player = new Player(this.server.game)
		this.player.state.state = PlayerStateValue.Waiting
		this.player.state.connected = true

		this.server.game.add(this.player)
	}
}
