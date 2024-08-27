import { GameModeType } from './modes/types'
import { GameStateValue } from './game'
import { MapType } from './map'
import { ExpansionType } from './expansions/types'

export interface GameInfo {
	id: string
	name: string
	mode: GameModeType
	state: GameStateValue
	players: number
	maxPlayers: number
	prelude: boolean
	map: MapType
	expansions: ExpansionType[]
	spectatorsEnabled: boolean
	draft: boolean
}

export interface ServerInfo {
	singleGame: boolean
	servers: number
	maxServers: number
	botsEnabled: boolean
}
