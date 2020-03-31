import { Card } from './types'
import { Cards } from './list'

export const CardsLookupApi = {
	_data: null as Record<string, Card> | null,
	_length: 0,

	data() {
		if (!this._data || this._length !== Cards.length) {
			this._data = Cards.reduce((acc, c) => {
				acc[c.code] = c
				return acc
			}, {} as Record<string, Card>)
		}
		return this._data
	},

	get(code: string) {
		const c = this.data()[code]
		if (!c) {
			throw new Error(`Unknown card ${code}`)
		}
		return c
	},
}
