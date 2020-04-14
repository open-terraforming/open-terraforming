import { Player } from '@/game/player'
import { MyEvent } from '@/utils/events'
import { Logger } from '@/utils/log'
import {
	GameMessage,
	GameStateValue,
	HandshakeError,
	handshakeResponse,
	JoinError,
	joinResponse,
	MessageType,
	serverMessage,
	VERSION,
	PlayerStateValue
} from '@shared/index'
import WebSocket from 'ws'
import { GameServer } from './game-server'

enum ClientState {
	Initializing,
	Connected
}

export class Client {
	get logger() {
		return new Logger(
			this.player ? `GameClient(${this.player.name})` : 'GameClient'
		)
	}

	server: GameServer
	socket: WebSocket
	state: ClientState

	player?: Player

	onDisconnected = new MyEvent()

	get game() {
		return this.server.game
	}

	constructor(server: GameServer, socket: WebSocket) {
		this.server = server
		this.state = ClientState.Initializing

		this.socket = socket
		this.socket.on('message', this.handleRawMessage)
		this.socket.on('close', this.handleClose)
	}

	handleClose = () => {
		const player = this.player
		if (player) {
			// Remove player when in lobby, mark as disconnected otherwise
			if (this.game.state.state === GameStateValue.WaitingForPlayers) {
				this.logger.log(
					'Client disconnected in lobby - removing player from game'
				)

				this.game.remove(player)
			} else {
				player.state.connected = !!this.server.clients.find(
					p => p !== this && p.player?.id === player.id
				)

				this.logger.log(
					player.state.connected
						? 'Client disconnected - but other clients are connected to its player'
						: 'Client disconnected - marking as disconnected'
				)

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
			this.send(result)
		}
	}

	handleMessage(message: GameMessage) {
		try {
			if (this.player === undefined) {
				switch (message.type) {
					case MessageType.HandshakeRequest: {
						const { version } = message.data

						if (version !== VERSION) {
							return handshakeResponse(HandshakeError.InvalidVersion)
						}

						return handshakeResponse(undefined, this.game.state.state)
					}

					case MessageType.JoinRequest: {
						const { name, session } = message.data

						if (session) {
							const p = this.game.players.find(p => p.state.session === session)
							if (p) {
								this.logger.log('Session matched, joining as existing player')

								this.player = p
								this.player.state.connected = true
								this.player.updated()

								return joinResponse(
									undefined,
									this.player.state.session,
									this.player.state.id
								)
							} else {
								return joinResponse(JoinError.InvalidSession)
							}
						}

						if (this.game.inProgress) {
							return joinResponse(JoinError.GameInProgress)
						}

						if (!name || name.trim().length < 3 || name.length > 10) {
							return joinResponse(JoinError.InvalidName)
						}

						this.state = ClientState.Connected
						this.player = new Player(this.game)
						this.player.state.state = PlayerStateValue.Waiting
						this.player.state.name = name
						this.player.state.connected = true

						this.game.add(this.player)

						return joinResponse(
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
						return this.player.toggleReady(message.data.ready)
					}

					case MessageType.PickCorporation: {
						return this.player.pickCorporation(message.data.code)
					}

					case MessageType.PickCards: {
						return this.player.pickCards(message.data.cards)
					}

					case MessageType.PickPreludes: {
						return this.player.pickPreludes(message.data.cards)
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
						if (this.player.state.admin) {
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

					case MessageType.PickColor: {
						return this.player.pickColor(message.data.index)
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
