import express from 'express'
import { join } from 'path'
import WebSocket from 'ws'
import { createServer } from 'http'
import { Server } from './server/server'
import yargs from 'yargs'
import { cardsImagesMiddleware } from './server/images'

async function main() {
	const app = express()
	const wsServer = new WebSocket.Server({ noServer: true })

	const argv = yargs
		.scriptName('card-game-server')
		.command('', 'Starts the server')
		.option('port', {
			type: 'number',
			alias: 'p',
			default: 8090
		}).argv

	const server = createServer(app)
	server.on('upgrade', (request, socket, head) => {
		wsServer.handleUpgrade(request, socket, head, ws => {
			wsServer.emit('connection', ws, request)
		})
	})

	const gameServer = new Server(wsServer, 3)

	app.use(express.static(join(__dirname, '..', 'static')))
	app.use(cardsImagesMiddleware())

	server.listen(argv.port, () => {
		console.log('Listening on', argv.port)
	})
}

main()
