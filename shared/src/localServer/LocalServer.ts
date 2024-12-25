import {
	GameMessage,
	gameStateFull,
	handshakeResponse,
	joinResponse,
	MessageType,
	serverMessage,
} from '@shared/actions'
import { Game, GameConfig, GameLockSystem } from '@shared/game/game'
import { MyEvent } from '@shared/utils/events'
import { GameState } from '../gameState'
import { ConsoleLogger } from './ConsoleLogger'
import { LocalClient } from './LocalClient'
import { deepCopy } from '@shared/utils/collections'

export class LocalServer {
	logger = new ConsoleLogger('GameServer')

	game: Game
	localClient: LocalClient

	onMessage = new MyEvent<GameMessage>()
	onUpdate = new MyEvent<GameState>()

	constructor(lockSystem: GameLockSystem, config?: Partial<GameConfig>) {
		this.game = new Game(lockSystem, this.logger, config)
		this.game.onStateUpdated.on(this.handleGameUpdate)

		this.localClient = new LocalClient(this)
	}

	connect = () => {}
	dispose = () => {}

	load = (s: GameState, c: GameConfig) => {
		this.game.load(s, c)
	}

	handleGameUpdate = async (s: GameState) => {
		this.onUpdate.emit(s)
		setTimeout(() => this.onMessage.emit(gameStateFull(deepCopy(s))), 1)
	}

	send(message: GameMessage) {
		if (message.type === MessageType.HandshakeRequest) {
			return this.onMessage.emit(handshakeResponse(undefined, this.game.info()))
		}

		if (message.type === MessageType.JoinRequest) {
			this.localClient.player.state.name = message.data.name ?? 'Player'

			return this.onMessage.emit(
				joinResponse(
					undefined,
					this.localClient.player.state.session,
					this.localClient.player.state.id,
				),
			)
		}

		try {
			this.localClient.player.performAction(message)
		} catch (e) {
			this.logger.error(e)

			this.onMessage.emit(serverMessage((e as Error).toString()))
		}
	}
}
