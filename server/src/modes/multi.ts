import { corsMiddleware } from '@/server/cors'
import { cardsImagesMiddleware } from '@/server/images'
import { ServerOptions } from '@/server/types'
import { Logger } from '@/utils/log'
import { ServerInfo } from '@shared/extra'
import { GameModes } from '@shared/modes'
import { GameModeType } from '@shared/modes/types'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { createServer, IncomingMessage } from 'http'
import { Socket } from 'net'
import { join } from 'path'
import { GameServer } from '../server/game-server'

export const multiApp = (config: ServerOptions) => {
	const logger = new Logger('Master')
	let servers: GameServer[] = []

	const app = express()
	const server = createServer(app)

	app.use(corsMiddleware())
	app.use(express.static(join(__dirname, '..', 'static')))
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(bodyParser.raw())
	app.use(cardsImagesMiddleware())

	server.on(
		'upgrade',
		(request: IncomingMessage, socket: Socket, head: Buffer) => {
			try {
				const gameMatch = /game\/([a-z0-9-]+)\/socket$/.exec(
					request.url as string
				)
				if (!gameMatch) {
					throw new Error(`Cannot upgrade, unknown game id ${request.url}`)
				}

				const game = servers.find(
					s => s.acceptsConnections && s.id === gameMatch[1]
				)
				if (!game) {
					throw new Error(`Failed to find game ${gameMatch[1]}`)
				}

				logger.log('New connection to ' + game.id)

				game.socket.handleUpgrade(request, socket, head, ws => {
					game.socket.emit('connection', ws, request)
				})
			} catch (e) {
				logger.error(e)
				socket.end()
			}
		}
	)

	app.get('/info', (_req, res) => {
		res.json({
			maxServers: config.maxServers,
			servers: servers.length,
			singleGame: config.singleGame
		} as ServerInfo)
	})

	app.get('/games', (_req, res) => {
		res.json(servers.filter(s => s.listable).map(s => s.info()))
	})

	app.post(
		'/games',
		[
			body('name')
				.isLength({ min: 3, max: 20 })
				.trim(),
			body('mode')
				.notEmpty()
				.isInt(),
			body('bots')
				.isInt({ min: 0, max: 4 })
				.optional(true),
			body('public')
				.isBoolean()
				.optional(true)
		],
		(req: Request, res: Response) => {
			if (servers.length >= config.maxServers) {
				throw new Error(`All server slots are filled now`)
			}

			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() })
			}

			const name = req.body.name
			const mode = GameModes[req.body.mode as GameModeType]
			const bots = req.body.bots
			const isPublic = !!req.body.public

			if (!mode) {
				throw new Error(`Unknown game mode ${req.body.mode}`)
			}

			const gameServer = new GameServer({
				name,
				mode: mode.type,
				bots,
				public: isPublic
			})

			gameServer.onEnded.on(() => {
				logger.log(`Server ${gameServer.id} removed - game ended`)
				servers = servers.filter(s => s !== gameServer)
			})
			gameServer.onEmpty.on(() => {
				logger.log(`Server ${gameServer.id} removed - no active players`)
				servers = servers.filter(s => s !== gameServer)
			})

			servers.push(gameServer)

			res.json(gameServer.info())

			logger.log(`New ${gameServer.id} - ${name}`)
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

	server.listen(config.port, () => {
		logger.log('Listening on', config.port)
	})

	return { app, server }
}
