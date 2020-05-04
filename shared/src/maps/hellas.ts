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
		2: { plants: 2, type: GridCellType.Ocean },
		3: { plants: 2 },
		4: { plants: 2 },
		5: { plants: 1, ore: 1 },
		6: { plants: 1 }
	},
	1: {
		1: { plants: 2, type: GridCellType.Ocean },
		2: { plants: 2 },
		3: { plants: 1 },
		4: { plants: 1, ore: 1 },
		5: { plants: 1 },
		6: { plants: 1 }
	},
	2: {
		1: { plants: 1, type: GridCellType.Ocean },
		2: { plants: 1 },
		3: { ore: 1 },
		4: { ore: 1 },
		5: {},
		6: { plants: 2 },
		7: { plants: 1, cards: 1 }
	},
	3: {
		0: { plants: 1, type: GridCellType.Ocean },
		1: { plants: 1 },
		2: { ore: 1 },
		3: { ore: 2 },
		4: { ore: 1 },
		5: { plants: 1, type: GridCellType.Ocean },
		6: { plants: 2, type: GridCellType.Ocean },
		7: { plants: 1 }
	},
	4: {
		0: { cards: 1 },
		1: {},
		2: {},
		3: { ore: 2 },
		4: {},
		5: { cards: 1, type: GridCellType.Ocean },
		6: { heat: 3, type: GridCellType.Ocean },
		7: { type: GridCellType.Ocean },
		8: { plants: 1 }
	},
	5: {
		0: { titan: 1 },
		1: {},
		2: { ore: 1 },
		3: {},
		4: {},
		5: { type: GridCellType.Ocean },
		6: { ore: 1, type: GridCellType.Ocean },
		7: {}
	},
	6: {
		1: { titan: 2, type: GridCellType.Ocean },
		2: {},
		3: {},
		4: { cards: 1 },
		5: {},
		6: {},
		7: { titan: 1 }
	},
	7: {
		1: { ore: 1 },
		2: { cards: 1 },
		3: { heat: 2 },
		4: { heat: 2 },
		5: { titan: 1 },
		6: { titan: 1 }
	},
	8: {
		0: {
			type: GridCellType.GanymedeColony,
			special: GridCellSpecial.GanymedeColony,
			outside: true
		},
		2: {},
		3: { heat: 2 },
		4: { money: -6, oceans: 1 },
		5: { heat: 2 },
		6: {}
	}
}

export const hellasMap = mapInfo({
	type: MapType.Hellas,
	name: 'Hellas',
	build: () => {
		const grid = generateGrid(9, 9, (x, y) => preset[y][x])

		const map: MapState = {
			code: MapType.Hellas,
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
				CompetitionType.Cultivator,
				CompetitionType.Magnate,
				CompetitionType.SpaceBaron,
				CompetitionType.Eccentric,
				CompetitionType.Contractor
			],
			milestones: [
				MilestoneType.Diversifier,
				MilestoneType.Tactician,
				MilestoneType.PolarExplorer,
				MilestoneType.Energizer,
				MilestoneType.RimSettler
			]
		}

		return map
	}
})
