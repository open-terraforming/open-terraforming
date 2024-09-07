import { MapType } from './map'
import { GameModeType } from './modes/types'
import { ExpansionType } from './expansions/types'

export type NewGameRequest = {
	name: string
	mode: GameModeType
	map: MapType
	expansions: ExpansionType[]
	bots?: number
	public?: boolean
	spectatorsAllowed?: boolean
	draft?: boolean
	solarPhase?: boolean
	fastBots?: boolean
	disablePlayersAfterDisconnectingInSeconds?: number
}
