import {
	adminChange,
	adminLogin,
	GameMessage,
	MessageType,
} from '@shared/index'
import { stripUndefined } from '@shared/utils'
import { decode, encode } from 'msgpack-lite'

enum SocketCloseCodes {
	UserRequest = 3001,
}

export class FrontendGameClient {
	server: string
	socket?: WebSocket
	gameId?: string

	onDisconnected?: () => void
	onConnected?: () => void
	onMessage?: (data: GameMessage) => void

	reconnectCount = 0
	reconnectTimeout?: ReturnType<typeof setTimeout>

	constructor(server: string) {
		this.server = server

		this.exposeAdminCommands()
	}

	send(msg: GameMessage) {
		if (!this.socket) {
			throw new Error('No socket')
		}

		if (typeof msg !== 'object') {
			throw new Error('Trying to send non-object - no!')
		}

		console.log('Outgoing', MessageType[msg.type], msg)

		return this.socket?.send(encode(stripUndefined(msg)))
	}

	connect(gameId: string | null) {
		// We're already connected to this game, do nothing
		if (gameId === this.gameId) {
			return
		}

		// No game means we should disconnect and be done with it
		if (!gameId) {
			this.resetReconnectTimeout()

			this.socket?.close(SocketCloseCodes.UserRequest)
			this.socket = undefined
			this.gameId = undefined

			return
		}

		this.gameId = gameId
		this.reconnectCount = 0
		this.resetReconnectTimeout()
		this.connectToCurrentGameId()
	}

	private resetReconnectTimeout() {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout)
			this.reconnectTimeout = undefined
		}
	}

	private exposeAdminCommands() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, padding-line-between-statements
		;(window as any)['adminLogin'] = (password: string) => {
			this.send(adminLogin(password))
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(window as any)['adminSend'] = (data: any) => {
			this.send(adminChange(data))
		}
	}

	private getFullUrl() {
		return (this.server + `/api/ws/game/${this.gameId}/`).replace(
			/\/{2,}/g,
			'/',
		)
	}

	private connectToCurrentGameId() {
		const url = this.getFullUrl()

		this.socket = new WebSocket(url)

		const connectionTimeout = setTimeout(() => {
			if (this.socket?.readyState !== this.socket?.OPEN) {
				this.socket?.close()
			}
		}, 2 * 1000)

		this.socket.onopen = () => {
			clearTimeout(connectionTimeout)
			this.onConnected?.()
		}

		this.socket.onmessage = async (msg) => {
			if (this.onMessage) {
				if (typeof msg.data === 'string') {
					this.onMessage(JSON.parse(msg.data.toString()))
				} else if (msg.data instanceof Blob) {
					const data = decode(new Uint8Array(await msg.data.arrayBuffer()))
					this.onMessage(data)
				} else {
					console.error(msg)
					throw new Error('Unknown message: ' + typeof msg)
				}
			}
		}

		this.socket.onclose = (ev) => {
			// Do nothing when it was requested by us
			if (ev.code === SocketCloseCodes.UserRequest) {
				return
			}

			// Attempt to reconnect, but limit it to 5 times
			if (this.reconnectCount < 5) {
				this.reconnectTimeout = setTimeout(
					() => {
						this.reconnectTimeout = undefined
						this.reconnect()
					},
					1 + this.reconnectCount * 300,
				)

				this.reconnectCount++

				return
			}

			// We failed to connect, so we're disconnected
			this.onDisconnected?.()
		}
	}

	private reconnect() {
		if (!this.gameId) {
			return
		}

		this.connect(this.gameId)
	}

	dispose() {
		this.socket?.close(SocketCloseCodes.UserRequest)
		this.socket = undefined
	}
}
