import express from 'express'
import { join } from 'path'
import WebSocket from 'ws'
import { createServer } from 'http'
import { Server } from './server/server'

async function main() {
	const app = express()
	const wsServer = new WebSocket.Server({ noServer: true })

	const server = createServer(app)
	server.on('upgrade', (request, socket, head) => {
		wsServer.handleUpgrade(request, socket, head, ws => {
			wsServer.emit('connection', ws, request)
		})
	})

	const gameServer = new Server(wsServer)

	app.use(express.static(join(__dirname, '..', 'static')))

	server.listen(8090, () => {
		console.log('Listening on 8090')
	})
}

main()
