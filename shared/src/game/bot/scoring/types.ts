import { GameState, PlayerState } from '@shared/index'
import { AiScoringCoefficients } from './defaultScoringCoefficients'

export type ScoringContext = {
	scoring: AiScoringCoefficients
	player: PlayerState
	game: GameState
}
