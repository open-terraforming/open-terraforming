import { Game } from '@/game/game'
import { GameState, gameStateUpdate } from '@shared/index'
import WebSocket from 'ws'
import { Client } from './client'

export class Server {
	game: Game
	socket: WebSocket.Server

	clients: Client[] = []

	constructor(socket: WebSocket.Server, bots = 0) {
		this.game = new Game({ bots })
		this.game.onStateUpdated.on(this.handleGameUpdate)

		this.socket = socket
		this.socket.on('connection', this.handleConnection)
	}

	handleConnection = (s: WebSocket) => {
		const client = new Client(this.game, s)
		client.onDisconnected.on(() => this.handleDisconnect(client))
		this.clients.push(client)
	}

	handleDisconnect = (client: Client) => {
		this.clients = this.clients.filter(i => i !== client)
	}

	handleGameUpdate = (s: GameState) => {
		const update = gameStateUpdate(s)
		this.clients.forEach(c => {
			c.send(update)
		})
	}
}
