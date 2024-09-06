import { Resource } from '@shared/cards'
import { colonyBonus } from '../utils'
import { PLAYER_RESOURCE_TO_PRODUCTION } from '@shared/constants'

export const colonyResourceProductionBonus = (
	resource: Resource,
	count: number,
) =>
	colonyBonus({
		symbols: [{ resource, production: true, count }],
		perform: ({ player }) => {
			player[PLAYER_RESOURCE_TO_PRODUCTION[resource]] += count
		},
	})
