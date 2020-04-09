import { Game } from '@/game/game'
import { GameState, gameStateUpdate } from '@shared/index'
import WebSocket from 'ws'
import { Client } from './client'
import { promises as fs } from 'fs'
import { cachePath } from '@/config'
import { join } from 'path'
import { Logger } from '@/utils/log'
import { debounce } from '@/utils/debounce'

export class Server {
	logger = new Logger('Server')

	game: Game
	socket: WebSocket.Server

	clients: Client[] = []

	constructor(socket: WebSocket.Server, bots = 0) {
		this.game = new Game({ bots })
		this.game.onStateUpdated.on(this.handleGameUpdate)

		this.logger.log('Admin password', this.game.config.adminPassword)

		this.socket = socket
		this.socket.on('connection', this.handleConnection)
	}

	load = (s: GameState) => {
		this.game.load(s)
	}

	handleConnection = (s: WebSocket) => {
		const client = new Client(this, s)
		client.onDisconnected.on(() => this.handleDisconnect(client))
		this.clients.push(client)
	}

	handleDisconnect = (client: Client) => {
		this.clients = this.clients.filter(i => i !== client)
	}

	handleGameUpdate = debounce(async (s: GameState) => {
		const update = gameStateUpdate(s)

		this.clients.forEach(c => {
			c.send(update)
		})

		try {
			await fs.writeFile(
				join(cachePath, this.game.config.adminPassword + '.json'),
				JSON.stringify(s)
			)
		} catch (e) {
			this.logger.error('Failed to save game state:', e)
		}
	}, 10)
}
