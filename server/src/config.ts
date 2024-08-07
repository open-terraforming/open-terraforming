import { configDotenv } from 'dotenv'
import { join } from 'path'

configDotenv()

export const globalConfig = {
	cardEditor: {
		googleApiKey: process.env.CARD_EDITOR_GOOGLE_API_KEY,
		googleCseId: process.env.CARD_EDITOR_GOOGLE_CSE_ID
	},
	metrics: {
		endpoint: process.env.METRICS_ENDPOINT ?? '/metrics',
		username: process.env.METRICS_USERNAME ?? 'metrics',
		password: process.env.METRICS_PASSWORD ?? 'metrics'
	},
	port: parseInt(process.env.PORT ?? '80', 10),
	slots: parseInt(process.env.OT_SLOTS ?? '20', 10),
	fastBots: process.env.OT_FAST_BOTS === 'true',
	cachePath: process.env.OT_CACHE_PATH ?? join(__dirname, '..', '.cache'),
	storagePath: process.env.OT_STORAGE_PATH ?? join(__dirname, '..', 'storage'),
	staticPath: process.env.OT_STATIC_PATH ?? join(__dirname, '..', 'static'),
	everybodyIsAdmin: process.env.OT_EVERYBODY_IS_ADMIN === 'true'
}
