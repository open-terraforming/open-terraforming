import { Resource } from '@shared/cards'
import { colonyBonus } from '../templates/colonyBonus'

export const colonyResourceBonus = (resource: Resource, count: number) =>
	colonyBonus({
		symbols: [{ resource, count }],
		perform: ({ player }) => {
			player[resource] += count
		},
	})
