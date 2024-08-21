import { startGame } from '@shared/actions'
import { GameStateValue } from '@shared/game'
import { Game } from '../game/game'
import { wait } from '../utils/async'
import { ExpansionType } from '@shared/expansions/types'

describe('brute', () => {
	it('bots can finish the game', async () => {
		const game = new Game({
			bots: 4,
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

		while (true) {
			await wait(5)

			if (game.state.state === GameStateValue.Ended) {
				break
			}
		}

		expect(game.state.state).toBe(GameStateValue.Ended)
	})
})
