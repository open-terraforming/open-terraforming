import { RealtimeEvent, RealtimeEventEmit } from '@shared/events'
import { encode, decode } from 'msgpack-lite'
import { MyEvent } from '@/utils/events'

export class EventsClient {
	server: string
	socket?: WebSocket

	onOpen?: () => void
	onClose?: () => void
	onEvent = new MyEvent<RealtimeEvent>()

	constructor(server: string) {
		this.server = server
		this.connect()
	}

	send(msg: RealtimeEventEmit) {
		if (typeof msg !== 'object') {
			throw new Error('Trying to send non-object - no!')
		}

		if (this.socket?.readyState !== this.socket?.OPEN) {
			return
		}

		return this.socket?.send(encode(msg))
	}

	connect() {
		this.socket = new WebSocket(this.server)

		const timeout = setTimeout(() => {
			if (
				this.socket?.readyState !== this.socket?.OPEN &&
				this.socket?.readyState !== this.socket?.CLOSED
			) {
				this.socket?.close()
			}
		}, 2 * 1000)

		this.socket.onopen = () => {
			clearTimeout(timeout)
			this.onOpen && this.onOpen()
		}

		this.socket.onmessage = async msg => {
			if (!(msg.data instanceof Blob)) {
				console.error('Unknown msg data', msg.data)
			}

			const data = decode(new Uint8Array(await msg.data.arrayBuffer()))
			this.onEvent.emit(data)
		}

		this.socket.onclose = () => {
			this.onClose && this.onClose()
		}
	}

	reconnect() {
		if (this.socket) {
			this.socket.close()
		}

		this.connect()
	}

	disconnect() {
		this.socket?.close()
	}
}
