import {
	GameMessage,
	adminChange,
	adminLogin,
	MessageType
} from '@shared/index'
import { decode, encode } from 'msgpack-lite'

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

	send(msg: object) {
		if (typeof msg !== 'object') {
			throw new Error('Trying to send non-object - no!')
		}

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
			const data = decode(
				new Uint8Array(await msg.data.arrayBuffer())
			) as GameMessage

			if (!data) {
				throw new Error('Failed to parse message')
			}

			console.groupCollapsed(`Received ${MessageType[data?.type]}`)
			console.log(data)
			console.groupEnd()

			this.onMessage && this.onMessage(data)
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
