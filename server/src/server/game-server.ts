import { Game, GameConfig } from '@/game/game'
import { saveOngoing } from '@/storage'
import { debounce } from '@/utils/debounce'
import { MyEvent } from '@/utils/events'
import { Logger } from '@/utils/log'
import { GameState, GameStateValue } from '@shared/index'
import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { EventServer } from './event-server'
import { Client } from './game-client'
import { playerCountGauge } from '@/utils/metrics'
import { Duplex } from 'stream'

export class GameServer {
	logger = new Logger('GameServer')

	/** in ms */
	closeEmptyAfter = 5 * 60 * 1000

	/** in ms */
	closeEndedAfter = 20 * 60 * 1000

	game: Game
	socket: WebSocket.Server
	events: EventServer

	clients: Client[] = []

	onEnded = new MyEvent()
	onEmpty = new MyEvent()
	onClose = new MyEvent()

	emptyTimeout?: ReturnType<typeof setTimeout>
	endedTimeout?: ReturnType<typeof setTimeout>

	constructor(config?: Partial<GameConfig>) {
		this.game = new Game(config)
		this.game.onStateUpdated.on(this.handleGameUpdate)

		this.logger.log('Admin password', this.game.config.adminPassword)

		this.events = new EventServer(this)

		this.socket = new WebSocket.Server({ noServer: true })
		this.socket.on('connection', this.handleConnection)

		this.emptyTimeout = setTimeout(() => {
			this.onEmpty.emit()
		}, this.closeEmptyAfter)
	}

	get id() {
		return this.game.state.id
	}

	load = (s: GameState) => {
		this.game.load(s)
	}

	get acceptsConnections() {
		return true
	}

	get listable() {
		return (
			!this.game.inProgress &&
			this.game.config.public &&
			this.game.state.players.length < this.game.state.maxPlayers
		)
	}

	handleUpgrade = (
		request: IncomingMessage,
		socket: Duplex,
		upgradeHead: Buffer,
	) => {
		this.socket.handleUpgrade(request, socket, upgradeHead, (ws) => {
			this.socket.emit('connection', ws)
		})
	}

	handleConnection = (s: WebSocket) => {
		const client = new Client(this, s)
		client.onDisconnected.on(() => this.handleDisconnect(client))
		this.clients.push(client)

		if (this.emptyTimeout !== undefined) {
			clearTimeout(this.emptyTimeout)
			this.emptyTimeout = undefined
		}

		playerCountGauge.set(this.clients.length)
	}

	handleDisconnect = (client: Client) => {
		this.clients = this.clients.filter((i) => i !== client)

		if (this.clients.length === 0 && this.emptyTimeout === undefined) {
			this.emptyTimeout = setTimeout(() => {
				this.onEmpty.emit()
				this.close()
			}, this.closeEmptyAfter)
		}

		playerCountGauge.set(this.clients.length)
	}

	handleGameUpdate = debounce(async (s: GameState) => {
		this.clients.forEach((c) => {
			c.sendUpdate(s)
		})

		if (
			this.game.state.state === GameStateValue.Ended &&
			this.endedTimeout === undefined
		) {
			this.endedTimeout = setTimeout(() => {
				this.onEnded.emit()
				this.close()
			}, this.closeEndedAfter)
		}

		try {
			saveOngoing(this.game.state)
		} catch (e) {
			this.logger.error('Failed to save game state:', e)
		}
	}, 10)

	close() {
		this.socket.close()

		this.clients.forEach((c) => {
			c.socket.close()
		})

		this.clients = []
		this.onClose.emit()
	}

	info() {
		return this.game.info()
	}
}
