import ImageSearch from '@/lib/image-google-search'
import { saveToCache, tryLoadCache } from '@/storage'
import { CardCategory, CardsLookupApi } from '@shared/cards'
import { Router } from 'express'
import got from 'got'
import config from '../../config'
import { normalizeImage } from '@/utils/images'

const attr = (s: string) => s.replace(/"/g, '"')

export default () => {
	const router = Router()

	const searchClient = new ImageSearch(config.googleCseId, config.googleApiKey)

	router.get('/picker', async (req, res) => {
		const card = Object.values(CardsLookupApi.data()).find(c => {
			return !tryLoadCache(c.code)
		})

		if (!card) {
			return res.send('No card to fill')
		}

		const q =
			req.query['q'] ||
			card.title + ' ' + card.categories.map(c => CardCategory[c]).join(' ')

		const page = req.query['page'] ? parseInt(req.query['page'], 10) : 0

		const data = await searchClient.search(q, {
			excludeTerms: 'terraforming mars',
			imgType: 'photo',
			start: page * 10
		})

		res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#ffffff" />
		<title>Card picker</title>
		<style>
		#application { display: flex; flex-wrap: wrap; }
		#application img { width: 200px; transition: transform 0.1s; }
		#application img:hover { transform: scale(1.2); }
		</style>
	</head>
	<body>
		<h2>${card.title}</h2> <a href="?page=${page + 1}&q=${attr(q)}">next</a>
		<form method="get"><input type="text" name="q" value="${attr(
			q
		)}" /><button>Search</button></form>
		<div id="application">
			${data
				.map(
					d =>
						`<form method="post" action="/picker/${
							card.code
						}"><input type="hidden" name="url" value="${attr(
							d
						)}" /><button><img src="${attr(d)}" /></button></form>`
				)
				.join('')}
		</div>
	</body>
</html>
		`)
	})

	router.post('/picker/:code', async (req, res) => {
		const card = CardsLookupApi.get(req.params['code'])
		const url = req.body.url
		try {
			const image = await got(url, {
				responseType: 'buffer'
			})

			if (image.body && image.headers['content-type']?.includes('image')) {
				const jpeg = await normalizeImage(image.body)

				res.redirect('/picker')
				await saveToCache(card.code, jpeg)
			} else {
				throw Error(
					'Response was not an image (' +
						image.headers['content-type'] +
						',' +
						typeof image.body +
						')'
				)
			}
		} catch (e) {
			console.error(e)
			res.type('html').send('<h2>' + e + '</h2><a href="/picker">Back</a>')
		}
	})

	return router
}
