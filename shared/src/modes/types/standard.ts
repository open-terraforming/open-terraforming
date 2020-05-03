import { GameModeType } from '../types'
import {
	gameMode,
	prepareCorporations,
	prepareCards,
	preparePreludes
} from '../utils'

export const StandardMode = gameMode({
	type: GameModeType.Standard,
	description:
		'Everybody starts with 0 production of everything, extended set of cards is available.',
	name: 'Standard rules',
	onGameStart: game => {
		prepareCorporations(game)
		prepareCards(game)
		preparePreludes(game)
	}
})
