import yargs from 'yargs'
import { globalConfig } from './config'
import { httpServer } from './server/http/http-server'
import { ServerOptions } from './server/types'
import { NodeLogger } from './lib/node-logger'

export async function main() {
	const logger = new NodeLogger('Main')

	const argv = await yargs
		.scriptName('card-game-server')
		.command('', 'Starts the server')
		.option('port', {
			type: 'number',
			alias: 'p',
			default: globalConfig.port,
		})
		.option('slots', {
			type: 'number',
			description: 'Number of server slots',
			default: globalConfig.slots,
		}).argv

	const serverConfig: ServerOptions = {
		maxServers: argv.single ? 1 : argv.slots,
		port: argv.port,
	}

	const serverStart = await httpServer(serverConfig)

	process.on('SIGTERM', () => {
		logger.info('SIGTERM signal received, shutting down')

		serverStart.server.close(() => {
			logger.info('Server closed, exiting')
			process.exit(0)
		})
	})

	return { port: serverStart.port }
}
