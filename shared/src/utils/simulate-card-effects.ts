import { CardEffect } from '../cards'
import { emptyCardState } from '../cards/utils'
import { initialPlayerState, initialGameState } from '../states'

export const simulateCardEffects = (
	card: string,
	effects: CardEffect[],
	player = initialPlayerState(),
	game = initialGameState(),
) => {
	// Make sure draw effects wont fail
	if (game.cards.length < 100) {
		game.cards = new Array(100).fill('simulated-card')
	}

	if (game.corporations.length < 100) {
		game.corporations = new Array(100).fill('simulated-corp')
	}

	if (game.preludeCards.length < 100) {
		game.preludeCards = new Array(100).fill('simulated-preludes')
	}

	effects.forEach((e) => {
		e.perform({
			card: emptyCardState(card),
			game,
			player,
		})
	})

	return { game, player }
}
