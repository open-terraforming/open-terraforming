import WebSocket from 'ws'
import { Client } from './client'
import { gameStateUpdate } from '@shared/index'
import { Game } from '@/game/game'
import { range } from '@/utils/collections'
import { Bot } from '@/game/bot'

export class Server {
	game: Game
	socket: WebSocket.Server

	clients: Client[] = []

	constructor(socket: WebSocket.Server, bots = 0) {
		this.game = new Game({ bots })
		this.game.onStateUpdated.on(s => {
			const update = gameStateUpdate(s)
			this.clients.forEach(c => {
				c.send(update)
			})
		})

		this.socket = socket

		this.socket.on('connection', s => {
			const client = new Client(this.game, s)
			client.onDisconnected.on(() => {
				this.clients = this.clients.filter(i => i !== client)
			})
			this.clients.push(client)
		})
	}
}
