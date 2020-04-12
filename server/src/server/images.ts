import { Router } from 'express'
import { promises as fs } from 'fs'
import { CardsLookupApi, CardCategory } from '@shared/cards'
import got from 'got'
import { join } from 'path'
import config from '../../config'
import ImageSearch from '@/lib/image-google-search'

export const cachePath = join(__dirname, '..', '..', '.cache')

export const cardsImagesMiddleware = () => {
	const router = Router()
	const searchClient = new ImageSearch(config.googleCseId, config.googleApiKey)

	router.get('/card/:code', async (req, res) => {
		const cardId = req.params['code']
		const cacheFilename = join(cachePath, cardId)
		try {
			await fs.access(cacheFilename)
			res.contentType('image/jpeg').send(await fs.readFile(cacheFilename))
		} catch (e) {
			try {
				const card = CardsLookupApi.get(cardId)
				const data = await searchClient.search(
					card.title +
						' ' +
						card.categories.map(c => CardCategory[c]).join(' '),
					{
						excludeTerms: 'terraforming mars',
						imgType: 'photo'
					}
				)
				while (data.length > 0) {
					try {
						const image = await got(data.shift() as string, {
							responseType: 'buffer'
						})

						if (
							image.body &&
							image.headers['content-type']?.includes('image')
						) {
							res
								.contentType(image.headers['content-type'] || 'image/jpeg')
								.send(image.body)
							fs.writeFile(cacheFilename, image.body)
							return
						}
					} catch (e) {
						console.log('Failed to fetch image')
					}
				}

				console.log('Nothing found for', cardId)
				res.status(404).send()
			} catch (e) {
				console.log(e)
				res.status(404).send()
			}
		}
	})

	return router
}
