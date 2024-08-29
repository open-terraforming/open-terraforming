import { GameLockSystem } from '@/game/game'
import { GameState } from '@shared/game'
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

type Settings = {
	path: string
}

export class FileGameLockSystem implements GameLockSystem {
	constructor(private settings: Settings) {}

	private gameLockFilename(id: string) {
		return join(this.settings.path, `${id}-lock.json`)
	}

	createLock(game: GameState) {
		mkdirSync(this.settings.path, { recursive: true })
		writeFileSync(this.gameLockFilename(game.id), JSON.stringify(game))
	}

	clearLock(id: string) {
		unlinkSync(this.gameLockFilename(id))
	}

	tryLoadLock(id: string) {
		try {
			const contents = readFileSync(this.gameLockFilename(id))

			return JSON.parse(contents.toString()) as GameState
		} catch {
			return null
		}
	}
}
