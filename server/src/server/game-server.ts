import { cachePath } from '@/config'
import { Game, GameConfig } from '@/game/game'
import { debounce } from '@/utils/debounce'
import { Logger } from '@/utils/log'
import { GameState, gameStateUpdate, GameStateValue } from '@shared/index'
import { promises as fs } from 'fs'
import { join } from 'path'
import WebSocket from 'ws'
import { Client } from './game-client'
import { MyEvent } from '@/utils/events'

export class GameServer {
	logger = new Logger('GameServer')

	game: Game
	socket: WebSocket.Server

	clients: Client[] = []

	onEnded = new MyEvent()
	onEmpty = new MyEvent()

	emptyTimeout?: ReturnType<typeof setTimeout>
	endedTimeout?: ReturnType<typeof setTimeout>

	constructor(config?: Partial<GameConfig>) {
		this.game = new Game(config)
		this.game.onStateUpdated.on(this.handleGameUpdate)

		this.logger.log('Admin password', this.game.config.adminPassword)

		this.socket = new WebSocket.Server({ noServer: true })
		this.socket.on('connection', this.handleConnection)
	}

	get id() {
		return this.game.state.id
	}

	load = (s: GameState) => {
		this.game.load(s)
	}

	get acceptsConnections() {
		return this.game.state.state !== GameStateValue.Ended
	}

	handleConnection = (s: WebSocket) => {
		if (!this.acceptsConnections) {
			s.close()
		}

		const client = new Client(this, s)
		client.onDisconnected.on(() => this.handleDisconnect(client))
		this.clients.push(client)

		if (this.emptyTimeout !== undefined) {
			clearTimeout(this.emptyTimeout)
			this.emptyTimeout = undefined
		}
	}

	handleDisconnect = (client: Client) => {
		this.clients = this.clients.filter(i => i !== client)

		if (this.clients.length === 0 && this.emptyTimeout === undefined) {
			this.emptyTimeout = setTimeout(() => {
				this.onEmpty.emit()
			}, 2 * 60 * 1000)
		}
	}

	handleGameUpdate = debounce(async (s: GameState) => {
		const update = gameStateUpdate(s)

		this.clients.forEach(c => {
			c.send(update)
		})

		if (
			this.game.state.state === GameStateValue.Ended &&
			this.endedTimeout === undefined
		) {
			this.onEnded.emit()

			this.endedTimeout = setTimeout(() => {
				this.clients.forEach(c => {
					c.socket.close()
				})
			}, 20 * 60 * 1000)
		}

		try {
			await fs.writeFile(
				join(cachePath, this.game.state.id + '.json'),
				JSON.stringify(s)
			)
		} catch (e) {
			this.logger.error('Failed to save game state:', e)
		}
	}, 10)

	info() {
		return this.game.info()
	}
}
