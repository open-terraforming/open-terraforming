import { GameState } from '@shared/index'
import {
	promises as fs,
	readFileSync,
	mkdirSync,
	writeFileSync,
	unlinkSync,
} from 'fs'
import { join, dirname } from 'path'
import { globalConfig } from './config'

const historyPath = join(globalConfig.storagePath, 'history')
const ongoingPath = join(globalConfig.storagePath, 'ongoing')

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
	} catch {
		return null
	}
}

export const saveLock = (game: GameState) => {
	mkdirSync(ongoingPath, { recursive: true })
	writeFileSync(join(ongoingPath, `${game.id}-lock.json`), JSON.stringify(game))
}

export const clearLock = (id: string) => {
	unlinkSync(join(ongoingPath, `${id}-lock.json`))
}

export const tryLoadLock = (id: string) => {
	try {
		const contents = readFileSync(join(ongoingPath, `${id}-lock.json`))

		return JSON.parse(contents.toString()) as GameState
	} catch {
		return null
	}
}

export const saveStatic = async (name: string, data: Buffer | string) => {
	await fs.mkdir(dirname(join(globalConfig.staticPath, name)), {
		recursive: true,
	})

	await fs.writeFile(join(globalConfig.staticPath, name), data)
}

export const tryLoadStatic = async (name: string) => {
	try {
		return await fs.readFile(join(globalConfig.staticPath, name))
	} catch {
		return null
	}
}

export const tryLoadStaticSync = (name: string) => {
	try {
		return readFileSync(join(globalConfig.staticPath, name))
	} catch {
		return null
	}
}
