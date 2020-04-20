import { GameModeType } from './modes/types'
import { GameStateValue } from './game'

export interface GameInfo {
	id: string
	name: string
	mode: GameModeType
	state: GameStateValue
	players: number
	maxPlayers: number
	prelude: boolean
}

export interface ServerInfo {
	singleGame: boolean
	servers: number
	maxServers: number
}
