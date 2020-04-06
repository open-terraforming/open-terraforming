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
	serverMessage,
	GameStateValue
} from '@shared/index'
import { Game } from '@/game/game'

enum ClientState {
	Initializing,
	Connected
}

export class Client {
	game: Game
	socket: WebSocket
	state: ClientState

	player?: Player

	onDisconnected = new MyEvent()

	constructor(game: Game, socket: WebSocket) {
		this.game = game
		this.state = ClientState.Initializing

		this.socket = socket
		this.socket.on('message', this.handleRawMessage)
		this.socket.on('close', this.handleClose)
	}

	handleClose = () => {
		if (this.player) {
			// Remove player when in lobby, mark as disconnected otherwise
			if (this.game.state.state === GameStateValue.WaitingForPlayers) {
				this.game.remove(this.player)
			} else {
				this.player.state.connected = false
				this.game.checkState()
			}
		}

		this.onDisconnected.emit()
	}

	handleRawMessage = (data: WebSocket.Data) => {
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
	}

	handleMessage(message: GameMessage) {
		try {
			if (this.player === undefined) {
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

						if (!name || name.trim().length < 3 || name.length > 10) {
							return handshakeResponse(HandshakeError.InvalidName)
						}

						if (version !== VERSION) {
							return handshakeResponse(HandshakeError.InvalidVersion)
						}

						this.state = ClientState.Connected
						this.player = new Player(this.game)
						this.player.state.name = name
						this.game.add(this.player)

						return handshakeResponse(
							undefined,
							this.player.state.session,
							this.player.state.id
						)
					}
					default: {
						return serverMessage(`Unknown action ${message.type}`)
					}
				}
			} else {
				switch (message.type) {
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

					case MessageType.PlayCard: {
						return this.player.playCard(
							message.data.card,
							message.data.index,
							message.data.args
						)
					}

					case MessageType.PlaceTile: {
						return this.player.placeTile(message.data.x, message.data.y)
					}

					case MessageType.AdminChange: {
						if (this.player.admin) {
							return this.game.adminChange(message.data)
						} else {
							throw new Error("You aren't admin")
						}
					}

					case MessageType.AdminLogin: {
						return this.player.adminLogin(message.data.password)
					}

					case MessageType.BuyStandardProject: {
						return this.player.buyStandardProject(
							message.data.project,
							message.data.cards
						)
					}

					case MessageType.BuyMilestone: {
						return this.player.buyMilestone(message.data.type)
					}

					case MessageType.SponsorCompetition: {
						return this.player.sponsorCompetition(message.data.type)
					}

					default: {
						return serverMessage(`Unknown action ${message.type}`)
					}
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
