import { GameConfig } from '@/game/game'
import { corsMiddleware } from '@/server/cors'
import { ServerOptions } from '@/server/types'
import { Logger } from '@/utils/log'
import { ServerInfo } from '@shared/extra'
import express from 'express'
import { createServer, IncomingMessage, Server } from 'http'
import { join } from 'path'
import { GameServer } from '../server/game-server'

type SingleAppContext = {
	app: express.Application
	game: GameServer
	server: Server
	port: number
}

export const singleApp = (
	config: ServerOptions,
	gameConfig: Partial<GameConfig>,
) => {
	const logger = new Logger('Master')

	const app = express()
	const server = createServer(app)

	app.use(corsMiddleware())
	app.use(express.static(join(__dirname, '..', '..', 'static')))
	app.use(express.urlencoded({ extended: true }))
	app.use(express.json())
	app.use(express.raw())

	const game = new GameServer(gameConfig)

	app.get('/api/info', (_req, res) => {
		res.json({
			maxServers: config.maxServers,
			servers: 1,
			singleGame: config.singleGame,
		} as ServerInfo)
	})

	server.on('upgrade', (request: IncomingMessage, socket, head) => {
		if (request.url?.endsWith('events')) {
			game.events.socket.handleUpgrade(request, socket, head, (ws) => {
				game.events.socket.emit('connection', ws, request)
			})
		} else {
			game.handleUpgrade(request, socket, head)
		}
	})

	return new Promise<SingleAppContext>((resolve) => {
		server.listen(config.port, () => {
			logger.log('Listening on', config.port)
			resolve({ app, game, server, port: config.port })
		})
	})
}
