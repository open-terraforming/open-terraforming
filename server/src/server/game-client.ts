import { globalConfig } from '@/config'
import { NodeLogger } from '@/lib/node-logger'
import { MyEvent } from '@/utils/events'
import { obfuscateGame } from '@/utils/game'
import { CardsLookupApi } from '@shared/cards'
import { Player } from '@shared/game/player'
import {
	GameMessage,
	GameState,
	gameStateUpdate,
	GameStateValue,
	HandshakeError,
	handshakeResponse,
	JoinError,
	joinResponse,
	kicked,
	MessageType,
	PlayerStateValue,
	serverMessage,
	SpectateError,
	spectateResponse,
	VERSION,
} from '@shared/index'
import { nonEmptyStringLength, sanitize, shuffle } from '@shared/utils'
import { decode, encode } from 'msgpack-lite'
import WebSocket from 'ws'
import { GameServer } from './game-server'

enum ClientState {
	Initializing,
	Connected,
}

export class Client {
	get logger() {
		return new NodeLogger(
			this.player ? `GameClient(${this.player.name})` : 'GameClient',
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
					'Client disconnected in lobby - removing player from game',
				)

				this.game.remove(player)
			} else {
				if (
					this.server.clients.find(
						(p) => p !== this && p.player?.id === player.id,
					) === undefined
				) {
					this.logger.log('Client disconnected - starting disconnect timer')

					player.handleDisconnect()
				} else {
					this.logger.log(
						'Client disconnected - but other clients are connected to its player',
					)
				}
			}
		}

		this.onDisconnected.emit()
	}

	handleRawMessage = (data: WebSocket.Data) => {
		let parsed: GameMessage

		try {
			if (typeof data === 'string') {
				parsed = JSON.parse(data.toString())
			} else if (data instanceof ArrayBuffer) {
				parsed = decode(new Uint8Array(data))
			} else {
				if (Array.isArray(data)) {
					data = Buffer.concat(data)
				}

				parsed = decode(data as Buffer)
			}
		} catch (e) {
			this.logger.error('Failed to parse message', e)

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

						if (this.server.spectators.length >= globalConfig.spectators.max) {
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

						if (session) {
							const p = this.game.players.find(
								(p) => p.state.session === session,
							)

							if (p) {
								this.logger.log('Session matched, joining as existing player')

								this.player = p
								this.player.handleConnect()

								return joinResponse(
									undefined,
									this.player.state.session,
									this.player.state.id,
								)
							} else {
								return joinResponse(JoinError.InvalidSession)
							}
						}

						if (this.game.inProgress) {
							return joinResponse(JoinError.GameInProgress)
						}

						if (
							this.server.connectedPlayers.length >= globalConfig.players.max
						) {
							return joinResponse(JoinError.PlayersLimitReached)
						}

						name = sanitize(name)

						const length = nonEmptyStringLength(name)

						if (!name || length < 3 || length > 10) {
							return joinResponse(JoinError.InvalidName)
						}

						if (
							this.game.players.find(
								(p) => p.name.replace(/\s/g, '') === name?.replace(/\s/g, ''),
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
							this.player.state.id,
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

			return serverMessage((e as Error).toString())
		}
	}

	send(update: GameMessage) {
		this.socket.send(encode(update))
	}

	sendUpdate(game: GameState) {
		if (!this.cardDictionary) {
			this.cardDictionary = shuffle(Object.keys(CardsLookupApi.data())).reduce(
				(acc, c, i) => {
					acc[c] = i.toString(16)

					return acc
				},
				{} as Record<string, string>,
			)
		}

		if (this.player || this.spectator) {
			this.send(
				gameStateUpdate(
					obfuscateGame(game, this.player?.id ?? -1, this.cardDictionary),
				),
			)
		}
	}
}
