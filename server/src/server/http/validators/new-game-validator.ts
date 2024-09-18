import { ExpansionType } from '@shared/expansions/types'
import { MapType } from '@shared/map'
import { GameModeType } from '@shared/modes/types'
import {
	array,
	boolean,
	enums,
	integer,
	max,
	min,
	object,
	optional,
	size,
	string,
} from 'superstruct'

export const newGameValidator = object({
	name: size(string(), 3, 20),
	mode: enums([GameModeType.Beginner, GameModeType.Standard]),
	expansions: array(
		enums([
			ExpansionType.Base,
			ExpansionType.Prelude,
			ExpansionType.Venus,
			ExpansionType.Colonies,
		]),
	),
	bots: max(min(integer(), 0), 4),
	public: optional(boolean()),
	spectatorsAllowed: optional(boolean()),
	draft: optional(boolean()),
	map: enums([MapType.Elysium, MapType.Hellas, MapType.Standard]),
	solarPhase: optional(boolean()),
	fastBots: optional(boolean()),
	disablePlayersAfterDisconnectingInSeconds: optional(
		min(max(integer(), 216000), 5),
	),
})
