import {
	GameMessage,
	gameStateFull,
	handshakeResponse,
	joinResponse,
	MessageType,
	serverMessage,
} from '@shared/actions'
import { Game, GameConfig, GameLockSystem } from '@shared/game/game'
import { Player } from '@shared/game/player'
import { deepCopy } from '@shared/utils/collections'
import { MyEvent } from '@shared/utils/events'
import { GameState, PlayerStateValue } from '../gameState'
import { ConsoleLogger } from './ConsoleLogger'

export class LocalServer {
	logger = new ConsoleLogger('LocalServer')

	game: Game
	player?: Player

	onMessage = new MyEvent<GameMessage>()
	onUpdate = new MyEvent<GameState>()

	constructor(lockSystem: GameLockSystem, config?: Partial<GameConfig>) {
		this.game = new Game(lockSystem, this.logger, config)
		this.game.onStateUpdated.on(this.handleGameUpdate)
	}

	connect = () => {}
	dispose = () => {}

	load = (s: GameState, c: GameConfig) => {
		this.game.load(s, c)

		this.handleGameUpdate(this.game.state)
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
			const existingLocalPlayer = (this.player = this.game.players.find(
				(p) => p.state.bot === false,
			))

			if (existingLocalPlayer) {
				this.player = existingLocalPlayer
				this.player.state.connected = true
			} else {
				this.player = new Player(this.game)
				this.player.state.state = PlayerStateValue.Waiting
				this.player.state.name = message.data.name ?? 'Player'
				this.player.state.connected = true

				this.game.add(this.player)
			}

			return this.onMessage.emit(
				joinResponse(
					undefined,
					this.player.state.session,
					this.player.state.id,
				),
			)
		}

		try {
			this.player?.performAction(message)
		} catch (e) {
			this.logger.error(e)

			this.onMessage.emit(serverMessage((e as Error).toString()))
		}
	}
}
