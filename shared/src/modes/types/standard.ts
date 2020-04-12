import { GameModeType } from '../types'
import { gameMode, prepareCorporations } from '../utils'

export const StandardMode = gameMode({
	type: GameModeType.Standard,
	description: 'Standard rules',
	name: 'Standard game',
	onGameStart: game => {
		prepareCorporations(game)
	}
})
