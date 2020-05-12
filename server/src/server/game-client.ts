import { Player } from '@/game/player'
import { MyEvent } from '@/utils/events'
import { obfuscateGame } from '@/utils/game'
import { Logger } from '@/utils/log'
import {
	GameMessage,
	GameState,
	gameStateUpdate,
	GameStateValue,
	HandshakeError,
	handshakeResponse,
	JoinError,
	joinResponse,
	MessageType,
	PlayerStateValue,
	serverMessage,
	VERSION,
	kicked,
	spectateResponse,
	SpectateError
} from '@shared/index'
import WebSocket from 'ws'
import { GameServer } from './game-server'
import { sanitize, shuffle } from '@shared/utils'
import { CardsLookupApi } from '@shared/cards'

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

	cardDictionary?: Record<string, string>

	lastState?: GameState

	player?: Player

	spectator = false

	onDisconnected = new MyEvent()

	get game() {
		return this.server.game
	}

	constructor(server: GameServer, socket: WebSocket) {
		this.server = server
		this.state = ClientState.Initializing

		this.game.onPlayerKicked.on(this.handlePlayerKicked)

		this.socket = socket
		this.socket.on('message', this.handleRawMessage)
		this.socket.on('close', this.handleClose)
	}

	handlePlayerKicked = (player: Player) => {
		if (player === this.player) {
			this.send(kicked())

			setTimeout(() => {
				try {
					this.socket.close()
				} catch (e) {
					this.logger.warn(`Failed to close socket for kicked player: ${e}`)
				}
			}, 1)
		}
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

				player.updated()

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

						return handshakeResponse(undefined, this.game.info())
					}

					case MessageType.SpectateRequest: {
						if (!this.game.config.spectatorsAllowed) {
							return spectateResponse(SpectateError.NotAllowed)
						}

						this.state = ClientState.Connected
						this.spectator = true
						this.sendUpdate(this.game.state)

						return spectateResponse()
					}

					case MessageType.JoinRequest: {
						let { name } = message.data
						const { session } = message.data

						name = sanitize(name)

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

						if (
							this.game.players.find(
								p => p.name.replace(/\s/g, '') === name?.replace(/\s/g, '')
							)
						) {
							return joinResponse(JoinError.DuplicateName)
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
				this.player.performAction(message)
			}
		} catch (e) {
			this.logger.error(e)

			return serverMessage(e.toString())
		}
	}

	send(update: GameMessage) {
		this.socket.send(JSON.stringify(update))
	}

	sendUpdate(game: GameState) {
		if (!this.cardDictionary) {
			this.cardDictionary = shuffle(Object.keys(CardsLookupApi.data())).reduce(
				(acc, c, i) => {
					acc[c] = i.toString(16)

					return acc
				},
				{} as Record<string, string>
			)
		}

		if (this.player || this.spectator) {
			this.send(
				gameStateUpdate(
					obfuscateGame(game, this.player?.id ?? -1, this.cardDictionary)
				)
			)
		}
	}
}
