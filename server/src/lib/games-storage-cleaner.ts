import { Logger } from '@/utils/log'
import { GamesStorage } from './games-storage'

export class GamesStorageCleaner {
	logger = new Logger(this.constructor.name)

	constructor(
		private gamesStorage: GamesStorage,
		private settings: { maxAgeInMs: number; checkIntervalInMs: number },
	) {}

	private interval?: NodeJS.Timeout

	start() {
		this.clean()

		this.interval = setInterval(
			() => this.clean(),
			this.settings.checkIntervalInMs,
		)
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval)
		}
	}

	private async clean() {
		const files = await this.gamesStorage.list()
		const deleteAfter = Date.now() - this.settings.maxAgeInMs

		this.logger.info('Checking', files.length, 'files')

		for (const file of files) {
			if (file.lastModified.valueOf() < deleteAfter) {
				await this.gamesStorage.get(file.id)
			}
		}
	}
}
