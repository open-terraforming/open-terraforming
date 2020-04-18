import { EventType, GameEvent } from './types'

export const filterEvents = (events: GameEvent[], types: EventType[]) =>
	events.filter(e => types.includes(e.type))
