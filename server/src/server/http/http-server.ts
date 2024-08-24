import { globalConfig } from '@/config'
import { tryLoadOngoing } from '@/storage'
import { Logger } from '@/utils/log'
import express from 'express'
import { createServer, IncomingMessage, Server } from 'http'
import { Socket } from 'net'
import { ServerOptions } from '../types'
import { gamesController } from './controllers/games-controller'
import { infoController } from './controllers/info-controller'
import { metricsController } from './controllers/metrics-controller'
import { HttpContext } from './http-context'
import { corsMiddleware } from './middleware/cors-middleware'
import { errorHandlerMiddleware } from './middleware/error-handler-middleware'
import { expressMetricsMiddleware } from './middleware/express-metrics-middleware'
import { RunningGamesContainer } from './utils/running-games-container'

type HttpServerInfo = {
	app: express.Application
	server: Server
	port: number
}

export const httpServer = (config: ServerOptions) => {
	const logger = new Logger('Master')
	const gamesContainer = new RunningGamesContainer()

	const context: HttpContext = {
		config,
		gamesContainer,
	}

	const app = express()
	const server = createServer(app)

	app.use(corsMiddleware())
	app.use(express.static(globalConfig.staticPath))
	app.use(expressMetricsMiddleware)
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(express.raw())

	server.on(
		'upgrade',
		async (request: IncomingMessage, socket: Socket, head: Buffer) => {
			try {
				if (gamesContainer.servers.length >= config.maxServers) {
					throw new Error(`All server slots are filled now`)
				}

				const gameMatch = /api\/ws\/game\/([a-z0-9-]+)\//.exec(
					request.url as string,
				)

				if (!gameMatch) {
					throw new Error(`Cannot upgrade, unknown game id ${request.url}`)
				}

				let game = gamesContainer.servers.find(
					(s) => s.acceptsConnections && s.id === gameMatch[1],
				)

				if (!game) {
					// TODO: Check server limit when creating ongoing game
					const ongoing = await tryLoadOngoing(gameMatch[1])

					if (ongoing) {
						game = gamesContainer.startNewGame()
						game.load(ongoing)
					}
				}

				if (!game) {
					throw new Error(`Failed to find game ${gameMatch[1]}`)
				}

				if (request.url?.endsWith('/events')) {
					game.events.socket.handleUpgrade(request, socket, head, (ws) => {
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
		},
	)

	infoController(app, context)
	gamesController(app, context)

	metricsController(app, context)

	app.use(errorHandlerMiddleware)

	return new Promise<HttpServerInfo>((resolve) => {
		server.listen(config.port, () => {
			logger.log('Listening on', config.port)
			resolve({ app, server, port: config.port })
		})
	})
}
