import { GameState } from '@shared/index'
import { promises as fs } from 'fs'
import { join } from 'path'
import { storagePath, cachePath } from './config'

const historyPath = join(storagePath, 'history')
const ongoingPath = join(storagePath, 'ongoing')

export const saveHistory = async (game: GameState) => {
	await fs.mkdir(historyPath, { recursive: true })
	await fs.writeFile(join(historyPath, `${game.id}.json`), JSON.stringify(game))
}

export const saveOngoing = async (game: GameState) => {
	await fs.mkdir(ongoingPath, { recursive: true })
	await fs.writeFile(join(ongoingPath, `${game.id}.json`), JSON.stringify(game))
}

export const tryLoadOngoing = async (id: string) => {
	try {
		const contents = await fs.readFile(join(ongoingPath, `${id}.json`))
		return JSON.parse(contents.toString()) as GameState
	} catch (e) {
		return null
	}
}

export const saveToCache = async (name: string, data: Buffer | string) => {
	await fs.mkdir(cachePath, { recursive: true })
	await fs.writeFile(join(cachePath, name), data)
}

export const tryLoadCache = async (name: string) => {
	try {
		return await fs.readFile(join(cachePath, name))
	} catch (e) {
		return null
	}
}
