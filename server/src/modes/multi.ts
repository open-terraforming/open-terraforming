import { GameConfig } from '@/game/game'
import { corsMiddleware } from '@/server/cors'
import { ServerOptions } from '@/server/types'
import { tryLoadOngoing } from '@/storage'
import { Logger } from '@/utils/log'
import { Expansions } from '@shared/expansions'
import { ExpansionType } from '@shared/expansions/types'
import { ServerInfo } from '@shared/extra'
import { Maps } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { NewGameRequest } from '@shared/requests'
import { nonEmptyStringLength } from '@shared/utils'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { createServer, IncomingMessage, Server } from 'http'
import { Socket } from 'net'
import { join } from 'path'
import { GameServer } from '../server/game-server'

type MultiAppContext = {
	app: express.Application
	server: Server
	port: number
}

export const multiApp = (config: ServerOptions) => {
	const logger = new Logger('Master')
	let servers: GameServer[] = []

	const app = express()
	const server = createServer(app)

	app.use(corsMiddleware())
	app.use(express.static(join(__dirname, '..', '..', 'static')))
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(bodyParser.raw())

	const createGameServer = (config?: Partial<GameConfig>) => {
		const gameServer = new GameServer(config)

		gameServer.onEnded.on(() => {
			logger.log(`Server ${gameServer.id} removed - game ended`)
			servers = servers.filter(s => s !== gameServer)
		})

		gameServer.onEmpty.on(() => {
			logger.log(`Server ${gameServer.id} removed - no active players`)
			servers = servers.filter(s => s !== gameServer)
		})

		servers.push(gameServer)

		return gameServer
	}

	server.on(
		'upgrade',
		async (request: IncomingMessage, socket: Socket, head: Buffer) => {
			try {
				const gameMatch = /api\/ws\/game\/([a-z0-9-]+)\//.exec(
					request.url as string
				)

				if (!gameMatch) {
					throw new Error(`Cannot upgrade, unknown game id ${request.url}`)
				}

				let game = servers.find(
					s => s.acceptsConnections && s.id === gameMatch[1]
				)

				if (!game) {
					// TODO: Check server limit when creating ongoing game
					const ongoing = await tryLoadOngoing(gameMatch[1])

					if (ongoing) {
						game = createGameServer()
						game.load(ongoing)
					}
				}

				if (!game) {
					throw new Error(`Failed to find game ${gameMatch[1]}`)
				}

				if (request.url?.endsWith('/events')) {
					game.events.socket.handleUpgrade(request, socket, head, ws => {
						game?.events.socket.emit('connection', ws, request)
					})
				} else {
					logger.log('New connection to ' + game.id)

					game.handleUpgrade(request, socket, head)
				}
			} catch (e) {
				logger.error(e)
				socket.end()
			}
		}
	)

	app.get('/api/info', (_req, res) => {
		res.json({
			maxServers: config.maxServers,
			servers: servers.length,
			singleGame: config.singleGame
		} as ServerInfo)
	})

	app.get('/api/games', (_req, res) => {
		res.json(servers.filter(s => s.listable).map(s => s.info()))
	})

	app.post(
		'/api/games',
		[
			body('name')
				.isLength({ min: 3, max: 20 })
				.trim(),
			body('mode')
				.notEmpty()
				.isInt(),
			body('expansions').isArray(),
			body('bots')
				.isInt({ min: 0, max: 4 })
				.optional(true),
			body('public')
				.isBoolean()
				.optional(true),
			body('spectatorsAllowed')
				.isBoolean()
				.optional(true),
			body('map')
				.notEmpty()
				.isInt()
		],
		(req: Request, res: Response) => {
			if (servers.length >= config.maxServers) {
				throw new Error(`All server slots are filled now`)
			}

			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() })
			}

			const request = req.body as NewGameRequest
			const name = request.name as string
			const mode = GameModes[request.mode]
			const map = request.map
			const bots = parseInt((request.bots ?? '0').toString(), 10)
			const spectatorsAllowed = !!request.spectatorsAllowed
			const isPublic = !!request.public
			const expansions = Array.from(new Set(request.expansions))

			expansions.forEach(e => {
				if (
					typeof e !== 'number' ||
					!Expansions[e] ||
					e === ExpansionType.Base
				) {
					throw new Error(`Invalid expansion ${e}`)
				}
			})

			if (nonEmptyStringLength(name) < 3 || nonEmptyStringLength(name) > 20) {
				throw new Error('Invalid name')
			}

			if (!Maps[map]) {
				throw new Error(`Unknown map ${map}`)
			}

			if (!mode) {
				throw new Error(`Unknown game mode ${req.body.mode}`)
			}

			const gameServer = createGameServer({
				name,
				mode: mode.type,
				bots: isNaN(bots) ? 0 : bots,
				public: isPublic,
				map: map,
				spectatorsAllowed,
				expansions: [ExpansionType.Base, ...expansions],
				fastBots: config.fastBots
			})

			logger.log(`New ${gameServer.id} - ${name}`)

			res.json(gameServer.info())
		}
	)

	app.use(
		(
			err: Error,
			_req: express.Request,
			res: express.Response,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			next: () => void
		) => {
			logger.error(err)

			res.status(500).json({
				error: err.message
			})
		}
	)

	return new Promise<MultiAppContext>(resolve => {
		server.listen(config.port, () => {
			logger.log('Listening on', config.port)
			resolve({ app, server, port: config.port })
		})
	})
}
