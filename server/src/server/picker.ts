import ImageSearch from '@/lib/image-google-search'
import { saveStatic, tryLoadStaticSync } from '@/storage'
import { normalizeImage } from '@/utils/images'
import { Logger } from '@/utils/log'
import { CardCategory, CardsLookupApi } from '@shared/cards'
import express from 'express'
import got from 'got'
import config from '../../config'
import { ServerOptions } from './types'
import bodyParser from 'body-parser'

const attr = (s: string) => s.replace(/"/g, '"')

export default (serverConfig: ServerOptions) => {
	const logger = new Logger('Picker')

	const app = express()

	const searchClient = new ImageSearch(config.googleCseId, config.googleApiKey)

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())
	app.use(bodyParser.raw())

	app.get('/picker', async (req, res) => {
		const card = Object.values(CardsLookupApi.data()).find(c => {
			return !tryLoadStaticSync(`card/${c.code}.jpg`)
		})

		if (!card) {
			return res.send(
				'No card to fill (out of ' +
					Object.values(CardsLookupApi.data()).length +
					')'
			)
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
		
		button { width: 240px; height: 105px; background-position: center center;
			background-size: 100% auto;
			background-repeat: no-repeat; }
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
						)}" /><button style="background-image: url('${attr(
							d
						)}')"></button></form>`
				)
				.join('')}
		</div>
	</body>
</html>
		`)
	})

	app.post('/picker/:code', async (req, res) => {
		const card = CardsLookupApi.get(req.params['code'])
		const url = req.body.url

		try {
			const image = await got(url, {
				responseType: 'buffer'
			})

			if (image.body && image.headers['content-type']?.includes('image')) {
				const jpeg = await normalizeImage(image.body)

				res.redirect('/picker')
				await saveStatic(`card/${card.code}.jpg`, jpeg)
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

	app.listen(serverConfig.port, () => {
		logger.log('Listening on', serverConfig.port)
	})

	return app
}
