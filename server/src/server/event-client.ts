import { EventServer } from './event-server'
import { MyEvent } from '@/utils/events'
import WebSocket from 'ws'
import {
	RealtimeEventEmit,
	RealtimeEventType,
	RealtimeEvent
} from '@shared/events'
import { encode, decode } from 'msgpack-lite'
import { Logger } from '@/utils/log'

export class EventClient {
	get logger() {
		return new Logger(
			'EventClient' + (this.playerId ? `(${this.playerId})` : '')
		)
	}

	server: EventServer
	socket: WebSocket

	playerId?: number

	onDisconnected = new MyEvent()

	constructor(server: EventServer, socket: WebSocket) {
		this.server = server
		this.socket = socket

		this.socket.on('close', () => {
			this.onDisconnected.emit()
		})

		this.socket.on('message', this.handleRawMessage)
	}

	handleRawMessage = (data: WebSocket.Data) => {
		let parsed: RealtimeEventEmit

		try {
			if (typeof data === 'string') {
				throw new Error('Not a binary message')
			}

			if (data instanceof ArrayBuffer) {
				parsed = decode(new Uint8Array(data))
			} else {
				if (Array.isArray(data)) {
					data = Buffer.concat(data)
				}

				parsed = decode(data as Buffer)
			}

			if (!parsed) {
				this.logger.error('Failed to parse', data)
			}

			if (!this.playerId) {
				if (parsed.type === RealtimeEventType.Auth) {
					const session = parsed.session

					this.playerId = this.server.master.game.state.players.find(
						p => p.session === session
					)?.id

					this.logger.info('Auth request')
				}
			} else {
				this.server.emit({
					...parsed,
					playerId: this.playerId
				})
			}
		} catch (e) {
			this.logger.error('Failed to parse', data)

			return
		}
	}

	send(event: RealtimeEvent) {
		if (this.playerId !== undefined) {
			this.logger.info('Sending', event)
			this.socket.send(encode(event))
		}
	}
}
