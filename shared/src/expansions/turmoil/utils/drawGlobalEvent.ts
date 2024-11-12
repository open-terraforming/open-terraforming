import { GameState } from '@shared/index'
import { shuffle } from '@shared/utils'

export const drawGlobalEvent = (game: GameState) => {
	if (game.globalEvents.events.length === 0) {
		if (game.globalEvents.discardedEvents.length === 0) {
			throw new Error('No more global events to draw')
		}

		game.globalEvents.events = game.globalEvents.discardedEvents
		game.globalEvents.discardedEvents = []
		shuffle(game.globalEvents.events)
	}

	return game.globalEvents.events.splice(0, 1)[0]
}
