import { ExpansionType } from '@shared/expansions/types'
import { GameState } from '@shared/game'

export const hasExpansion = (game: GameState, expansion: ExpansionType) =>
	game.expansions.includes(expansion)
