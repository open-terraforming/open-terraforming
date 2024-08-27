import { ServerInfo } from '@shared/extra'
import { appController } from '../utils/app-controller'
import { globalConfig } from '@/config'

export const infoController = appController(
	'/api/info',
	(router, { config, gamesContainer }) => {
		router.get('/', (_, res) => {
			res.json({
				maxServers: config.maxServers,
				servers: gamesContainer.servers.length,
				botsEnabled: globalConfig.bots.enabled,
			} satisfies ServerInfo)
		})
	},
)
