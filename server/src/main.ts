import { promises as fs } from 'fs'
import yargs from 'yargs'
import { globalConfig } from './config'
import { httpServer } from './server/http/http-server'
import { ServerOptions } from './server/types'
import { Logger } from './utils/log'

export async function main() {
	const logger = new Logger('Main')

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

	try {
		fs.mkdir(globalConfig.cachePath, { recursive: true })
	} catch (e) {
		logger.error('Failed to create cache path', e)
	}

	const serverConfig: ServerOptions = {
		maxServers: argv.single ? 1 : argv.slots,
		port: argv.port,
	}

	const serverStart = await httpServer(serverConfig)

	return { port: serverStart.port }
}
