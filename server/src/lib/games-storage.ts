import { GameState } from '@shared/game'
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileCompression } from './file-compression'

type Settings = {
	path: string
	useCompression: boolean
}

export class GamesStorage {
	constructor(private settings: Settings) {}

	private gameFilename(id: string) {
		return join(this.settings.path, `${id}.json`)
	}

	private async encode(game: GameState) {
		if (this.settings.useCompression) {
			return fileCompression.encode(JSON.stringify(game))
		}

		return JSON.stringify(game)
	}

	async put(game: GameState) {
		await mkdir(this.settings.path, { recursive: true })
		await writeFile(this.gameFilename(game.id), await this.encode(game))
	}

	async get(id: string) {
		const contents = await readFile(this.gameFilename(id))

		if (contents.toString('utf-8').startsWith('{')) {
			return JSON.parse(contents.toString()) as GameState
		}

		return JSON.parse(await fileCompression.decode(contents)) as GameState
	}

	async has(id: string) {
		try {
			await stat(this.gameFilename(id))

			return true
		} catch {
			return false
		}
	}

	async remove(id: string) {
		await unlink(this.gameFilename(id))
	}

	async tryGet(id: string) {
		try {
			return await this.get(id)
		} catch {
			return null
		}
	}

	async list() {
		try {
			await stat(this.settings.path)
		} catch {
			return []
		}

		const files = await readdir(this.settings.path, { withFileTypes: true })

		return await Promise.all(
			files
				.filter((f) => f.isFile() && f.name.endsWith('.json'))
				.map(async (f) => ({
					id: f.name.replace(/\.json$/, ''),
					lastModified: (await stat(join(f.path, f.name))).mtime,
				})),
		)
	}
}
