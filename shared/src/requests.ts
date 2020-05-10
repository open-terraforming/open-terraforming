import { MapType } from './map'
import { GameModeType } from './modes/types'

export type NewGameRequest = {
	name: string
	mode: GameModeType
	map: MapType
	bots?: number
	public?: boolean
	spectatorsAllowed?: boolean
}
