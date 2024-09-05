import { Colony } from '@shared/game'
import { baseColonies } from './baseColonies'

export const COLONIES_LIST = [...baseColonies]

export class ColoniesLookupApi {
	static list = COLONIES_LIST

	private static map = null as Map<string, Colony> | null
	private static mapSourceLength = 0

	static get data(): Map<string, Colony> {
		if (!this.map || this.mapSourceLength !== COLONIES_LIST.length) {
			this.map = new Map(COLONIES_LIST.map((c) => [c.code, c]))
			this.mapSourceLength = COLONIES_LIST.length
		}

		return this.map
	}

	static get(code: string): Colony {
		const c = this.getOptional(code)

		if (c === undefined) {
			throw new Error(`Unknown colony ${code}`)
		}

		return c
	}

	static getOptional(code: string): Colony | undefined {
		return this.data.get(code)
	}
}
