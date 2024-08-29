import 'module-alias/register'
import 'source-map-support/register'

import { startGame } from '@shared/actions'
import { Game } from './game/game'
import { DummyGameLockSystem } from './lib/dummy-game-lock-system'

async function main() {
	const game = new Game(new DummyGameLockSystem(), {
		bots: 4,
		fastBots: true,
		fastProduction: true,
	})

	game.players[0].state.owner = true
	game.players[0].performAction(startGame())
}

main().catch(console.error)
