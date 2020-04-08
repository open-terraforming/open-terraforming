import { Card } from './types'
import { Cards } from './list'

export class CardsLookupApi {
	static _data = null as Record<string, Card> | null
	static _length = 0

	static data() {
		if (!this._data || this._length !== Cards.length) {
			this._data = Cards.reduce((acc, c) => {
				acc[c.code] = c
				return acc
			}, {} as Record<string, Card>)
		}
		return this._data
	}

	static get(code: string): Card {
		const c = this.getOptional(code)
		if (c === undefined) {
			throw new Error(`Unknown card ${code}`)
		}
		return c
	}

	static getOptional(code: string): Card | undefined {
		return this.data()[code]
	}
}
