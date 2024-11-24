import { GameState } from '@shared/index'
import { deepCopy } from '@shared/utils/collections'
import { buildEvents } from '../events/buildEvents'

/** @deprecated use Game.startEventsCollector instead, it works reorders events correctly */
export const startEventCollector = (game: GameState) => {
	const gameCopy = deepCopy(game)

	return {
		collect: () => {
			return buildEvents(gameCopy, game)
		},
	}
}
