import { ServerInfo } from '@shared/extra'
import { appController } from '../utils/app-controller'

export const infoController = appController(
	'/api/info',
	(router, { config, gamesContainer }) => {
		router.get('/', (_, res) => {
			res.json({
				maxServers: config.maxServers,
				servers: gamesContainer.servers.length,
				singleGame: config.singleGame,
			} satisfies ServerInfo)
		})
	},
)
