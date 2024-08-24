import { globalConfig } from '@/config'
import { register } from 'prom-client'
import { basicAuthMiddleware } from '../middleware/basic-auth-middleware'
import { appController } from '../utils/app-controller'

export const metricsController = appController(
	globalConfig.metrics.endpoint,
	(router) => {
		router.use(
			basicAuthMiddleware({
				username: globalConfig.metrics.username,
				password: globalConfig.metrics.password,
			}),
		)

		router.get('/', (_, res) => {
			res.contentType(register.contentType)

			register
				.metrics()
				.then((r) => res.end(r))
				.catch((err) => {
					res.status(500).end(String(err))
				})
		})
	},
)
