import { GameConfig } from '@/game/game'
import { Logger } from '@/utils/log'
import { GameServer } from '../../game-server'
import { runningGamesGauge } from '@/utils/metrics'

export class RunningGamesContainer {
	logger = new Logger(this.constructor.name)

	servers: GameServer[] = []

	startNewGame(config?: Partial<GameConfig>) {
		const gameServer = new GameServer(config)

		gameServer.onEnded.on(() => {
			this.logger.log(`Server ${gameServer.id} removed - game ended`)
			this.servers = this.servers.filter((s) => s !== gameServer)

			runningGamesGauge.set(this.servers.length)
		})

		gameServer.onEmpty.on(() => {
			this.logger.log(`Server ${gameServer.id} removed - no active players`)
			this.servers = this.servers.filter((s) => s !== gameServer)

			runningGamesGauge.set(this.servers.length)
		})

		this.servers.push(gameServer)
		runningGamesGauge.set(this.servers.length)

		return gameServer
	}
}
