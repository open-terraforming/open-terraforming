import { Resource } from '@shared/cards'
import { colonyBonus } from '../utils'

export const colonyResourceBonus = (resource: Resource, count: number) =>
	colonyBonus({
		symbols: [{ resource, count }],
		perform: ({ player }) => {
			player[resource] += count
		},
	})
