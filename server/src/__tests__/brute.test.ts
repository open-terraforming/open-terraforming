import { DummyGameLockSystem } from '@/lib/dummy-game-lock-system'
import { startGame } from '@shared/actions'
import { ExpansionType } from '@shared/expansions/types'
import { Bot } from '@shared/game/bot/bot'
import { NullLogger } from '@shared/lib/null-logger'
import { deduplicate } from '@shared/utils/deduplicate'
import { Game } from '../../../shared/src/game/game'
import { wait } from '../utils/async'

describe('brute', () => {
	it('bots can run for 5 generations', async () => {
		const game = new Game(new DummyGameLockSystem(), new NullLogger(), {
			bots: 2,
			instantBots: true,
			fastProduction: true,
			expansions: [
				ExpansionType.Base,
				ExpansionType.Prelude,
				ExpansionType.Venus,
				ExpansionType.Colonies,
			],
			wgTerraforming: true,
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
		expect(deduplicate(game.state.cards).length).toBe(game.state.cards.length)
	}, 15000)
})
