import { ServerOptions } from '../types'
import { RunningGamesContainer } from './utils/running-games-container'

export type HttpContext = {
	gamesContainer: RunningGamesContainer
	config: ServerOptions
}
