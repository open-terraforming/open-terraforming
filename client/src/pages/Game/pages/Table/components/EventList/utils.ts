import { EventType, GameEvent } from '@shared/index'

export const filterEvents = (events: GameEvent[], types: EventType[]) =>
	events.filter((e) => types.includes(e.type))
