import { GameStateValue } from '@shared/index'
import { BaseGameState } from './base-game-state'

export class WaitingForPlayersGameState extends BaseGameState {
	name = GameStateValue.WaitingForPlayers
}
