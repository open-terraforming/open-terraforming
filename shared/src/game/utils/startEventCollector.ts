import { GameState } from '@shared/index'
import { deepCopy } from '@shared/utils/collections'
import { buildEvents } from '../events/buildEvents'

export const startEventCollector = (game: GameState) => {
	const gameCopy = deepCopy(game)

	return {
		collect: () => {
			return buildEvents(gameCopy, game)
		},
	}
}
