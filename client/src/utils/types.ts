import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'
import { SavedSessionInfo } from './localSessionsStore'

export type ExportedGames = Record<
	string,
	SavedSessionInfo & {
		local?: { state: GameState; config: GameConfig }
	}
>
