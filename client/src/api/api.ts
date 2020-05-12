import {
	GameMessage,
	adminChange,
	adminLogin,
	MessageType
} from '@shared/index'
import { encode, decode } from 'msgpack-lite'

export class Client {
	server: string
	socket?: WebSocket

	onOpen?: () => void
	onClose?: () => void
	onMessage?: (data: GameMessage) => void

	constructor(server: string) {
		this.server = server
		this.connect()
	}

	send(msg: GameMessage) {
		if (typeof msg !== 'object') {
			throw new Error('Trying to send non-object - no!')
		}

		console.log('Outgoing', MessageType[msg.type], msg)

		return this.socket?.send(encode(msg))
	}

	connect() {
		this.socket = new WebSocket(this.server)

		const timeout = setTimeout(() => {
			if (this.socket?.readyState !== this.socket?.OPEN) {
				this.socket?.close()
			}
		}, 2 * 1000)

		this.socket.onopen = () => {
			clearTimeout(timeout)
			this.onOpen && this.onOpen()
		}

		this.socket.onmessage = async msg => {
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

		this.socket.onclose = () => {
			this.onClose && this.onClose()
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(window as any)['adminLogin'] = (password: string) => {
			this.send(adminLogin(password))
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(window as any)['adminSend'] = (data: any) => {
			this.send(adminChange(data))
		}
	}

	reconnect() {
		this.connect()
	}

	disconnect() {
		this.socket?.close()
	}
}
