import { GameModeType } from '../types'
import { gameMode, prepareStartingPick } from '../utils'

export const StandardMode = gameMode({
	type: GameModeType.Standard,
	description:
		'Everybody starts with 0 production of everything, extended set of cards is available.',
	name: 'Standard rules',
	onGameStart: (game) => {
		prepareStartingPick(game)
	},
})
