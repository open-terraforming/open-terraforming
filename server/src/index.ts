import { strToMode } from '@shared/modes/utils'
import { promises as fs } from 'fs'
import yargs from 'yargs'
import { cachePath } from './config'
import { multiApp } from './modes/multi'
import { singleApp } from './modes/single'
import picker from './server/picker'
import { ServerOptions } from './server/types'
import { Logger } from './utils/log'

async function main() {
	const logger = new Logger('Main')

	const argv = yargs
		.scriptName('card-game-server')
		.command('', 'Starts the server')
		.option('single', {
			type: 'boolean',
			alias: 's',
			default: false,
			description: 'Start server in single-game mode'
		})
		.option('picker', {
			type: 'boolean',
			default: false,
			description: 'Start card image picker instead'
		})
		.option('port', {
			type: 'number',
			alias: 'p',
			default: 8090
		})
		.option('mode', {
			type: 'string',
			enum: Object.keys(strToMode),
			alias: 'm',
			default: 'standard'
		})
		.option('load', {
			type: 'string',
			description: 'Load game saved state from file',
			alias: 'l'
		})
		.option('bots', {
			type: 'number',
			description: 'Number of bots',
			alias: 'b',
			default: 0
		})
		.option('slots', {
			type: 'number',
			description: 'Number of server slots',
			default: 20
		}).argv

	try {
		fs.mkdir(cachePath, { recursive: true })
	} catch (e) {
		logger.error('Failed to create cache path', e)
	}

	const mode = strToMode[argv.mode as keyof typeof strToMode]
	if (!mode) {
		throw new Error(`Unknown mode ${argv.mode}`)
	}

	const serverConfig: ServerOptions = {
		maxServers: argv.single ? 1 : argv.slots,
		port: argv.port,
		singleGame: argv.single
	}

	if (argv.picker) {
		picker(serverConfig)
	} else if (argv.single) {
		const { game } = singleApp(serverConfig, {
			bots: argv.bots,
			mode: mode
		})

		if (argv.load) {
			try {
				game.load(JSON.parse((await fs.readFile(argv.load)).toString()))
				logger.log(`Loaded game state from ${argv.load}`)
			} catch (e) {
				throw new Error('Failed to load game state from file')
			}
		}
	} else {
		multiApp(serverConfig)
	}
}

main().catch(e => {
	console.error('Fatal error:', e)
})
