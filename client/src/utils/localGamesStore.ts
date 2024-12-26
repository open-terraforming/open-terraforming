import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'
import { stripUndefined } from '@shared/utils'
import { decode, encode } from 'msgpack-lite'

const LOCAL_GAMES_PREFIX = 'ot-local-'

export const extractGameIdFromLocal = (gameId: string) => gameId.split('/')[1]

// TODO: Handle local storage file size limits somehow

const bufferToBase64 = (encodedBuffer: Buffer) => {
	let binary = ''
	const bytes = new Uint8Array(encodedBuffer)
	const len = bytes.byteLength

	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i])
	}

	const base64Buffer = btoa(binary)

	return base64Buffer
}

const base64ToBuffer = (base64Buffer: string) => {
	return Uint8Array.from(atob(base64Buffer), (c) => c.charCodeAt(0))
}

export const localGamesStore = {
	getGame(gameId: string) {
		const data = localStorage[LOCAL_GAMES_PREFIX + gameId]

		if (!data) {
			return null
		}

		return decode(base64ToBuffer(data)) as {
			state: GameState
			config: GameConfig
		}
	},

	setGame(gameId: string, data: { state: GameState; config: GameConfig }) {
		const encodedBuffer = encode(stripUndefined(data))
		const base64Buffer = bufferToBase64(encodedBuffer)

		try {
			localStorage[LOCAL_GAMES_PREFIX + gameId] = base64Buffer
		} catch {
			// TODO: Better handling on FE?
			alert(
				'Cannot save game, local storage is probably full. Delete some existing local games to continue saving.',
			)
		}
	},

	removeGame(gameId: string) {
		delete localStorage[LOCAL_GAMES_PREFIX + gameId]
	},
}
