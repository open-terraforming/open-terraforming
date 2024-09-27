import 'module-alias/register'
import 'source-map-support/register'

import { startGame } from '@shared/actions'
import { Game } from '../../shared/src/game/game'
import { DummyGameLockSystem } from './lib/dummy-game-lock-system'
import { NodeLogger } from './lib/node-logger'
import { ExpansionType } from '@shared/expansions/types'
import { GameStateValue } from '@shared/index'
import { wait } from '@shared/utils/async'

async function main() {
	const game = new Game(new DummyGameLockSystem(), new NodeLogger(''), {
		bots: 4,
		fastBots: true,
		fastProduction: true,
		wgTerraforming: true,
		expansions: [
			ExpansionType.Base,
			ExpansionType.Prelude,
			ExpansionType.Venus,
			ExpansionType.Colonies,
		],
	})

	game.players[0].state.owner = true
	game.players[0].performAction(startGame())

	while (game.state.state !== GameStateValue.Ended) {
		await wait(10)
	}
}

main().catch(console.error)
