import { Expansions } from '@shared/expansions'
import { ExpansionType } from '@shared/expansions/types'
import { Maps } from '@shared/maps'
import { GameModes } from '@shared/modes'
import { nonEmptyStringLength } from '@shared/utils'
import { assert } from 'superstruct'
import { appController } from '../utils/app-controller'
import { newGameValidator } from '../validators/new-game-validator'
import { Logger } from '@/utils/log'

export const gamesController = appController(
	'/api/games',
	(router, { gamesContainer, config }) => {
		const logger = new Logger('GamesController')

		router.get('/', (_, res) => {
			res.json(
				gamesContainer.servers.filter((s) => s.listable).map((s) => s.info()),
			)
		})

		router.post('/', async (req, res) => {
			if (gamesContainer.servers.length >= config.maxServers) {
				throw new Error(`All server slots are filled now`)
			}

			assert(req.body, newGameValidator)

			const request = req.body
			const name = request.name as string
			const mode = GameModes[request.mode]
			const map = request.map
			const bots = parseInt((request.bots ?? '0').toString(), 10)
			const spectatorsAllowed = !!request.spectatorsAllowed
			const isPublic = !!request.public
			const expansions = Array.from(new Set(request.expansions))
			const draft = request.draft
			const solarPhase = request.solarPhase

			expansions.forEach((e) => {
				if (
					typeof e !== 'number' ||
					!Expansions[e] ||
					e === ExpansionType.Base
				) {
					throw new Error(`Invalid expansion ${e}`)
				}
			})

			if (nonEmptyStringLength(name) < 3 || nonEmptyStringLength(name) > 20) {
				throw new Error('Invalid name')
			}

			if (!Maps[map]) {
				throw new Error(`Unknown map ${map}`)
			}

			if (!mode) {
				throw new Error(`Unknown game mode ${req.body.mode}`)
			}

			const gameServer = gamesContainer.startNewGame({
				name,
				mode: mode.type,
				bots: isNaN(bots) ? 0 : bots,
				public: isPublic,
				map: map,
				spectatorsAllowed,
				expansions: [ExpansionType.Base, ...expansions],
				fastBots: config.fastBots,
				draft,
				solarPhase,
			})

			logger.log(`New ${gameServer.id} - ${name}`)

			res.json(gameServer.info())
		})
	},
)
