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
				players: {
					max: globalConfig.players.max,
				},
				spectators: {
					max: globalConfig.spectators.max,
				},
				bots: {
					enabled: globalConfig.bots.enabled,
					max: globalConfig.bots.max,
					fast: globalConfig.bots.fast,
				},
			} satisfies ServerInfo)
		})
	},
)
