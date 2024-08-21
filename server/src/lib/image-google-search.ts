import got from 'got'
import qs from 'querystring'

const baseUrl = 'https://www.googleapis.com/'

export interface SearchResult {
	link: string
}

export interface SearchOptions {
	start?: number
	num?: number
	excludeTerms?: string
	imgType?: 'clipart' | 'face' | 'lineart' | 'stock' | 'photo' | 'animated'
}

export default class ImageSearch {
	private cseId: string
	private apiKey: string

	constructor(cseId: string, apiKey: string) {
		this.cseId = cseId
		this.apiKey = apiKey

		if (!this.cseId || !this.apiKey) {
			throw new Error('Api Key Or CSE ID is required!')
		}
	}

	async search(query: string, options: SearchOptions = {}) {
		if (!query || typeof query !== 'string') {
			throw new Error('Expected a query in string format!')
		}

		const res = await got<{ items: SearchResult[] }>(
			baseUrl +
				'customsearch/v1?' +
				qs.stringify({
					q: query,
					searchType: 'image',
					cx: this.cseId,
					key: this.apiKey,
					...options,
				}),
			{
				responseType: 'json',
			},
		)

		return (res.body?.items || []).map((i) => i.link)
	}
}
