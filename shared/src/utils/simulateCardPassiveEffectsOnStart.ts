import { CardPassiveEffect } from '../cards'
import { emptyCardState } from '../cards/utils'
import { initialGameState, initialPlayerState } from '../states'

export const simulateCardPassiveEffectsOnStart = (
	card: string,
	effects: CardPassiveEffect[],
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
		e.onPlay?.({
			card: emptyCardState(card),
			game,
			player,
		})
	})

	return { game, player }
}
