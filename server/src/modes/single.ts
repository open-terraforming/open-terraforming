import { GameConfig } from '@/game/game'
import { ServerOptions } from '@/server/types'
import { Logger } from '@/utils/log'
import bodyParser from 'body-parser'
import express from 'express'
import { createServer, IncomingMessage } from 'http'
import { join } from 'path'
import { GameServer } from '../server/game-server'
import { ServerInfo } from '@shared/extra'
import { corsMiddleware } from '@/server/cors'

export const singleApp = (
	config: ServerOptions,
	gameConfig: Partial<GameConfig>
) => {
	const logger = new Logger('Master')

	const app = express()
	const server = createServer(app)

	app.use(corsMiddleware())
	app.use(express.static(join(__dirname, '..', '..', 'static')))
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(bodyParser.raw())

	const game = new GameServer(gameConfig)

	app.get('/info', (_req, res) => {
		res.json({
			maxServers: config.maxServers,
			servers: 1,
			singleGame: config.singleGame
		} as ServerInfo)
	})

	server.on('upgrade', (request: IncomingMessage, socket, head) => {
		if (request.url?.endsWith('events')) {
			game.events.socket.handleUpgrade(request, socket, head, ws => {
				game.events.socket.emit('connection', ws, request)
			})
		} else {
			game.handleUpgrade(request, socket, head)
		}
	})

	server.listen(config.port, () => {
		logger.log('Listening on', config.port)
	})

	return { app, game, server }
}
