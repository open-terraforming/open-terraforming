import 'module-alias/register'
import 'source-map-support/register'

import { startGame } from '@shared/actions'
import { Game } from '../../shared/src/game/game'
import { DummyGameLockSystem } from './lib/dummy-game-lock-system'
import { NodeLogger } from './lib/node-logger'

async function main() {
	const game = new Game(new DummyGameLockSystem(), new NodeLogger(''), {
		bots: 4,
		fastBots: true,
		fastProduction: true,
	})

	game.players[0].state.owner = true
	game.players[0].performAction(startGame())
}

main().catch(console.error)
