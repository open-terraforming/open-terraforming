import { startGame } from '@shared/actions'
import { Game } from '../../../shared/src/game/game'
import { wait } from '../utils/async'
import { ExpansionType } from '@shared/expansions/types'
import { DummyGameLockSystem } from '@/lib/dummy-game-lock-system'
import { Bot } from '@shared/game/bot'

describe('brute', () => {
	it('bots can run for 5 generations', async () => {
		const game = new Game(new DummyGameLockSystem(), {
			bots: 2,
			fastBots: true,
			fastProduction: true,
			expansions: [
				ExpansionType.Base,
				ExpansionType.Prelude,
				ExpansionType.Venus,
			],
			solarPhase: true,
		})

		game.players[0].state.owner = true
		game.players[0].performAction(startGame())

		const start = Date.now()

		while (true) {
			await wait(5)

			if (game.state.generation > 5 || start + 10000 < Date.now()) {
				game.players.forEach((p) => (p instanceof Bot ? p.stop() : null))
				await wait(20)

				break
			}
		}

		expect(game.state.generation).toBeGreaterThan(5)
	}, 15000)
})
