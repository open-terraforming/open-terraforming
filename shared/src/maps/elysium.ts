import { GridCell, GridCellType, GridCellSpecial, MapState } from '..'
import { generateGrid, heatAt, oceanAt, temperatureAt, mapInfo } from './utils'
import { MapType } from '../map'
import { CompetitionType } from '../competitions'
import { MilestoneType } from '../milestones'

const preset: Record<number, Record<number, Partial<GridCell>>> = {
	0: {
		0: {
			type: GridCellType.PhobosSpaceHaven,
			special: GridCellSpecial.PhobosSpaceHaven,
			outside: true
		},
		2: { type: GridCellType.Ocean },
		3: { titan: 1, type: GridCellType.Ocean },
		4: { cards: 1, type: GridCellType.Ocean },
		5: { ore: 1, type: GridCellType.Ocean },
		6: { cards: 1 }
	},
	1: {
		1: { titan: 1, special: GridCellSpecial.HecatesTholus },
		2: {},
		3: {},
		4: { type: GridCellType.Ocean },
		5: { type: GridCellType.Ocean },
		6: { ore: 2 }
	},
	2: {
		1: { titan: 2, special: GridCellSpecial.ElysiumMons },
		2: {},
		3: { cards: 1 },
		4: {},
		5: { plants: 1, type: GridCellType.Ocean },
		6: { type: GridCellType.Ocean },
		7: { cards: 3, special: GridCellSpecial.OlympusMons }
	},
	3: {
		0: { plants: 1 },
		1: { plants: 1 },
		2: { plants: 1 },
		3: { plants: 2, type: GridCellType.Ocean },
		4: { plants: 1 },
		5: { plants: 1, type: GridCellType.Ocean },
		6: { plants: 1, type: GridCellType.Ocean },
		7: { plants: 1, ore: 1 }
	},
	4: {
		0: { plants: 2 },
		1: { plants: 2 },
		2: { plants: 2 },
		3: { plants: 2, type: GridCellType.Ocean },
		4: { plants: 2 },
		5: { plants: 3 },
		6: { plants: 2 },
		7: { plants: 2 },
		8: { plants: 1, titan: 1 }
	},
	5: {
		0: { ore: 1 },
		1: { plants: 1 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 1 },
		5: { plants: 1 },
		6: { plants: 1 },
		7: {}
	},
	6: {
		1: { titan: 1 },
		2: { ore: 1 },
		3: {},
		4: {},
		5: { ore: 1 },
		6: {},
		7: {}
	},
	7: {
		1: { ore: 2 },
		2: {},
		3: {},
		4: {},
		5: { ore: 2 },
		6: {}
	},
	8: {
		0: {
			type: GridCellType.GanymedeColony,
			special: GridCellSpecial.GanymedeColony,
			outside: true
		},
		2: { ore: 1 },
		3: {},
		4: { cards: 1 },
		5: { cards: 1 },
		6: { ore: 2 }
	}
}

export const elysiumMap = mapInfo({
	type: MapType.Elysium,
	name: 'Elysium',
	build: () => {
		const grid = generateGrid(9, 9, (x, y) => preset[y][x])

		const map: MapState = {
			code: MapType.Elysium,
			width: 9,
			height: 9,
			grid,
			initialOceans: 0,
			initialTemperature: -15,
			initialOxygen: 0,
			oceans: 9,
			temperature: 4,
			oxygen: 14,
			temperatureMilestones: [heatAt(-12), heatAt(-10), oceanAt(0)],
			oxygenMilestones: [temperatureAt(8)],
			competitions: [
				CompetitionType.Celebrity,
				CompetitionType.Industrialist,
				CompetitionType.DesertSettler,
				CompetitionType.EstateDealer,
				CompetitionType.Benefactor
			],
			milestones: [
				MilestoneType.Generalist,
				MilestoneType.Specialist,
				MilestoneType.Ecologist,
				MilestoneType.Tycoon,
				MilestoneType.Legend
			]
		}

		return map
	}
})
