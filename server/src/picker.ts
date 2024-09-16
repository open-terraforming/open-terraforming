import { globalConfig } from '@/config'
import { Card, CardsLookupApi } from '@shared/cards'
import bodyParser from 'body-parser'
import express from 'express'
import { existsSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { NodeLogger } from './lib/node-logger'

const cardPath = (c: Card) =>
	join(globalConfig.cardEditor.targetPath ?? '', `${c.code}.jpg`)

async function main() {
	const logger = new NodeLogger('Picker')
	const app = express()

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json({ limit: '1gb' }))
	app.use(bodyParser.raw())

	app.use(express.static('./picker'))

	app.get('/api/progress', (req, res) => {
		const all = Object.values(CardsLookupApi.data()).map((c) => c.code)
		const done = all.filter((c) => existsSync(cardPath({ code: c } as Card)))

		res.json({ all, done })
	})

	app.get('/api/card/next', (req, res) => {
		const card = Object.values(CardsLookupApi.data()).find((c) => {
			return !existsSync(cardPath(c))
		})

		res.json({ card })
	})

	app.post('/api/card/:code/image', async (req, res) => {
		const code = req.params.code
		const imageDataBase64 = req.body.imageData
		const cutX = req.body.cutX
		const cutY = req.body.cutY
		const cutW = req.body.cutW
		const cutH = req.body.cutH

		const imageBuffer = Buffer.from(
			imageDataBase64.split(';base64,').pop(),
			'base64',
		)

		const image = sharp(imageBuffer).extract({
			left: cutX,
			top: cutY,
			width: cutW,
			height: cutH,
		})

		await image.toFile(cardPath({ code } as Card))

		res.json({ ok: true })
	})

	app.listen(8051, () => {
		logger.log('Listening on', 8051)
	})

	return app
}

main().catch((e) => {
	console.error('Fatal error:', e)
	process.exit(1)
})
