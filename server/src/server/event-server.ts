import { RealtimeEvent } from '@shared/events'
import WebSocket from 'ws'
import { EventClient } from './event-client'
import { GameServer } from './game-server'
import { Logger } from '@/utils/log'

export class EventServer {
	logger = new Logger('EventServer')

	master: GameServer
	socket: WebSocket.Server

	clients: EventClient[] = []

	constructor(master: GameServer) {
		this.master = master

		this.socket = new WebSocket.Server({ noServer: true })
		this.socket.on('connection', this.handleConnection)

		this.master.onClose.on(() => {
			this.close()
		})
	}

	handleConnection = (s: WebSocket) => {
		const client = new EventClient(this, s)
		client.onDisconnected.on(() => this.handleDisconnect(client))
		this.clients.push(client)
	}

	handleDisconnect = (client: EventClient) => {
		this.clients = this.clients.filter((i) => i !== client)
	}

	close() {
		this.clients.forEach((c) => {
			c.socket.close()
		})

		this.socket.close()
	}

	emit(event: RealtimeEvent) {
		this.clients.forEach((c) => {
			if (event.playerId !== c.playerId) {
				c.send(event)
			}
		})
	}
}
