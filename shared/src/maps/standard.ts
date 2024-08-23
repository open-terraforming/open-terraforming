import { CompetitionType } from '../competitions'
import { GridCell, GridCellSpecial, GridCellType, MapState } from '../game'
import { MapType } from '../map'
import { MilestoneType } from '../milestones'
import { generateGrid, heatAt, mapInfo, oceanAt, temperatureAt } from './utils'

const preset: Record<number, Record<number, Partial<GridCell>>> = {
	0: {
		0: {
			type: GridCellType.PhobosSpaceHaven,
			special: GridCellSpecial.PhobosSpaceHaven,
			outside: true,
		},
		2: { ore: 2 },
		3: { ore: 2, type: GridCellType.Ocean },
		4: {},
		5: { cards: 1, type: GridCellType.Ocean },
		6: { type: GridCellType.Ocean },
	},
	1: {
		1: {},
		2: { ore: 1, special: GridCellSpecial.TharsisTholus },
		3: {},
		4: {},
		5: {},
		6: { cards: 2, type: GridCellType.Ocean },
	},
	2: {
		1: { cards: 1, special: GridCellSpecial.AscraeusMons },
		2: {},
		3: {},
		4: {},
		5: {},
		6: {},
		7: { ore: 1 },
	},
	3: {
		0: { plants: 1, titan: 1, special: GridCellSpecial.PavonisMons },
		1: { plants: 1 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 2 },
		5: { plants: 1 },
		6: { plants: 1 },
		7: { plants: 2, type: GridCellType.Ocean },
	},
	4: {
		0: { plants: 2, special: GridCellSpecial.ArsiaMons },
		1: { plants: 2 },
		2: {
			plants: 2,
			type: GridCellType.NoctisCity,
			special: GridCellSpecial.NoctisCity,
		},
		3: { plants: 2, type: GridCellType.Ocean },
		4: { plants: 2, type: GridCellType.Ocean },
		5: { plants: 2, type: GridCellType.Ocean },
		6: { plants: 2 },
		7: { plants: 2 },
		8: { plants: 2 },
	},
	5: {
		0: { plants: 1 },
		1: { plants: 2 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 1 },
		5: { plants: 1, type: GridCellType.Ocean },
		6: { plants: 1, type: GridCellType.Ocean },
		7: { plants: 1, type: GridCellType.Ocean },
	},
	6: {
		1: {},
		2: {},
		3: {},
		4: {},
		5: {},
		6: { plants: 1 },
		7: {},
	},
	7: {
		1: { ore: 2 },
		2: {},
		3: { cards: 1 },
		4: { cards: 1 },
		5: {},
		6: { titan: 1 },
	},
	8: {
		0: {
			type: GridCellType.GanymedeColony,
			special: GridCellSpecial.GanymedeColony,
			outside: true,
		},
		2: { ore: 1 },
		3: { ore: 2 },
		4: {},
		5: {},
		6: { titan: 2, type: GridCellType.Ocean },
	},
}

export const standardMap = mapInfo({
	type: MapType.Standard,
	name: 'Standard',
	build: () => {
		const grid = generateGrid(9, 9, (x, y) => preset[y][x])

		const map: MapState = {
			code: MapType.Standard,
			width: 9,
			height: 9,
			grid,
			initialOceans: 0,
			initialTemperature: -15,
			initialOxygen: 0,
			initialVenus: 0,
			oceans: 9,
			temperature: 4,
			oxygen: 14,
			venus: 15,
			temperatureMilestones: [heatAt(-12), heatAt(-10), oceanAt(0)],
			oxygenMilestones: [temperatureAt(8)],
			venusMilestones: [],
			competitions: [
				CompetitionType.Landlord,
				CompetitionType.Banker,
				CompetitionType.Scientist,
				CompetitionType.Thermalist,
				CompetitionType.Miner,
			],
			milestones: [
				MilestoneType.Terraformer,
				MilestoneType.Mayor,
				MilestoneType.Gardener,
				MilestoneType.Builder,
				MilestoneType.Planner,
			],
		}

		return map
	},
})
