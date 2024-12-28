import { SavedSessionInfo } from '@/store/modules/client'
import { GameConfig } from '@shared/game/game'
import { GameState } from '@shared/gameState'

export type ExportedGames = Record<
	string,
	SavedSessionInfo & {
		local?: { state: GameState; config: GameConfig }
	}
>
