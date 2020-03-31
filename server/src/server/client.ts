import WebSocket from 'ws'
import { Player } from '@/game/player'
import { MyEvent } from '@/utils/events'
import {
	GameMessage,
	MessageType,
	handshakeResponse,
	VERSION,
	HandshakeError,
	PlayerStateValue,
	serverMessage
} from '@shared/index'
import { Game } from '@/game/game'

enum ClientState {
	Initializing,
	Connected
}

export class Client {
	game: Game
	socket: WebSocket
	player: Player
	state: ClientState

	onDisconnected = new MyEvent()

	get inProgress() {
		return this.game.inProgress
	}

	constructor(game: Game, socket: WebSocket) {
		this.game = game
		this.state = ClientState.Initializing
		this.player = new Player(game)
		this.player.state.connected = true

		this.socket = socket
		this.socket.on('message', data => {
			let parsed: GameMessage
			try {
				parsed = JSON.parse(data.toString())
			} catch (e) {
				console.error('Failed to parse', data)
				return
			}

			const result = this.handleMessage(parsed)
			if (result) {
				this.socket.send(JSON.stringify(result))
			}
		})
		this.socket.on('close', () => {
			this.player.state.connected = false
			this.onDisconnected.emit()
		})
	}

	handleMessage(message: GameMessage) {
		try {
			switch (message.type) {
				case MessageType.HandshakeRequest: {
					const { name, version, session } = message.data

					if (session) {
						const p = this.game.players.find(p => p.state.session === session)
						if (p) {
							this.player = p
							this.player.state.connected = true
							this.player.updated()

							return handshakeResponse(
								undefined,
								this.player.state.session,
								this.player.state.id
							)
						} else {
							return handshakeResponse(HandshakeError.InvalidSession)
						}
					}

					if (this.game.inProgress) {
						return handshakeResponse(HandshakeError.GameInProgress)
					}

					if (!name || name.trim().length < 3) {
						return handshakeResponse(HandshakeError.InvalidName)
					}

					if (version !== VERSION) {
						return handshakeResponse(HandshakeError.InvalidVersion)
					}

					this.state = ClientState.Connected
					this.player.state.name = name
					this.game.add(this.player)

					return handshakeResponse(
						undefined,
						this.player.state.session,
						this.player.state.id
					)
				}

				case MessageType.PlayerReady: {
					return this.player.setState(
						message.data.ready
							? PlayerStateValue.Ready
							: PlayerStateValue.Waiting
					)
				}

				case MessageType.PickCorporation: {
					return this.player.pickCorporation(message.data.code)
				}

				case MessageType.PickCards: {
					return this.player.pickCards(message.data.cards)
				}

				case MessageType.PlayerPass: {
					return this.player.pass(message.data.force)
				}

				case MessageType.BuyCard: {
					return this.player.buyCard(
						message.data.card,
						message.data.index,
						message.data.useOre,
						message.data.useTitan,
						message.data.args
					)
				}

				case MessageType.PlaceTile: {
					return this.player.placeTile(message.data.x, message.data.y)
				}
			}
		} catch (e) {
			console.error(e)
			return serverMessage(e.toString())
		}
	}

	send(update: GameMessage) {
		this.socket.send(JSON.stringify(update))
	}
}
