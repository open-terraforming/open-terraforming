import express from 'express'
import { join } from 'path'
import WebSocket from 'ws'
import { createServer } from 'http'
import { Server } from './server/server'
import yargs from 'yargs'
import { cardsImagesMiddleware } from './server/images'
import bodyParser from 'body-parser'
import picker from './server/picker'
import { promises as fs } from 'fs'
import { cachePath } from './config'
import { Logger } from './utils/log'

async function main() {
	const logger = new Logger('Main')

	const app = express()
	const wsServer = new WebSocket.Server({ noServer: true })

	const argv = yargs
		.scriptName('card-game-server')
		.command('', 'Starts the server')
		.option('port', {
			type: 'number',
			alias: 'p',
			default: 8090
		})
		.option('load', {
			type: 'string',
			description: 'Load game saved state from file',
			alias: 'l'
		})
		.options('bots', {
			type: 'number',
			description: 'Number of bots',
			alias: 'b',
			default: 0
		}).argv

	try {
		fs.mkdir(cachePath, { recursive: true })
	} catch (e) {
		logger.error('Failed to create cache path', e)
	}

	const server = createServer(app)
	server.on('upgrade', (request, socket, head) => {
		wsServer.handleUpgrade(request, socket, head, ws => {
			wsServer.emit('connection', ws, request)
		})
	})

	const gameServer = new Server(wsServer, argv.bots)
	if (argv.load) {
		try {
			gameServer.load(JSON.parse((await fs.readFile(argv.load)).toString()))
			logger.log(`Loaded game state from ${argv.load}`)
		} catch (e) {
			throw new Error('Failed to load game state from file')
		}
	}

	app.use(express.static(join(__dirname, '..', 'static')))
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(bodyParser.raw())
	app.use(cardsImagesMiddleware())
	app.use(picker())

	server.listen(argv.port, () => {
		logger.log('Listening on', argv.port)
	})
}

main().catch(e => {
	console.error('Fatal error:', e)
})
