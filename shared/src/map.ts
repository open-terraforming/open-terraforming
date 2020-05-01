import { WithOptional } from './cards'
import {
	GridCell,
	GridCellSpecial,
	GridCellType,
	MapState,
	ProgressMilestoneItem,
	ProgressMilestoneType
} from './game'
import { CompetitionType } from './competitions'
import { MilestoneType } from './milestones'

const milestoneItem = (
	m: WithOptional<ProgressMilestoneItem, 'used'>
): ProgressMilestoneItem => ({ ...m, used: false })

const heatAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Heat,
		value
	})

const temperatureAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Temperature,
		value
	})

const oceanAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Ocean,
		value
	})

const cell = (c: Partial<GridCell>): GridCell => ({
	x: -1,
	y: -1,
	enabled: true,
	type: GridCellType.General,
	cards: 0,
	ore: 0,
	plants: 0,
	titan: 0,
	outside: false,
	...c
})

const generateGrid = (
	w: number,
	h: number,
	cb: (x: number, y: number) => Partial<GridCell> | undefined
) => {
	const grid = [] as GridCell[][]

	for (let x = 0; x < w; x++) {
		const col = [] as GridCell[]

		for (let y = 0; y < h; y++) {
			const update = cb(x, y)

			col.push(
				cell({
					x,
					y,
					enabled: !!update,
					...update
				})
			)
		}

		grid.push(col)
	}

	return grid
}

const preset: Record<number, Record<number, Partial<GridCell>>> = {
	0: {
		0: {
			type: GridCellType.PhobosSpaceHaven,
			special: GridCellSpecial.PhobosSpaceHaven,
			outside: true
		},
		2: { ore: 2 },
		3: { ore: 2, type: GridCellType.Ocean },
		4: {},
		5: { cards: 1, type: GridCellType.Ocean },
		6: { type: GridCellType.Ocean }
	},
	1: {
		1: {},
		2: { ore: 1, special: GridCellSpecial.TharsisTholus },
		3: {},
		4: {},
		5: {},
		6: { cards: 2, type: GridCellType.Ocean }
	},
	2: {
		1: { cards: 1, special: GridCellSpecial.AscraeusMons },
		2: {},
		3: {},
		4: {},
		5: {},
		6: {},
		7: { ore: 1 }
	},
	3: {
		0: { plants: 1, titan: 1, special: GridCellSpecial.PavonisMons },
		1: { plants: 1 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 2 },
		5: { plants: 1 },
		6: { plants: 1 },
		7: { plants: 2, type: GridCellType.Ocean }
	},
	4: {
		0: { plants: 2, special: GridCellSpecial.ArsiaMons },
		1: { plants: 2 },
		2: {
			plants: 2,
			type: GridCellType.NoctisCity,
			special: GridCellSpecial.NoctisCity
		},
		3: { plants: 2, type: GridCellType.Ocean },
		4: { plants: 2, type: GridCellType.Ocean },
		5: { plants: 2, type: GridCellType.Ocean },
		6: { plants: 2 },
		7: { plants: 2 },
		8: { plants: 2 }
	},
	5: {
		0: { plants: 1 },
		1: { plants: 2 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 1 },
		5: { plants: 1, type: GridCellType.Ocean },
		6: { plants: 1, type: GridCellType.Ocean },
		7: { plants: 1, type: GridCellType.Ocean }
	},
	6: {
		1: {},
		2: {},
		3: {},
		4: {},
		5: {},
		6: { plants: 1 },
		7: {}
	},
	7: {
		1: { ore: 2 },
		2: {},
		3: { cards: 1 },
		4: { cards: 1 },
		5: {},
		6: { titan: 1 }
	},
	8: {
		0: {
			type: GridCellType.GanymedeColony,
			special: GridCellSpecial.GanymedeColony,
			outside: true
		},
		2: { ore: 1 },
		3: { ore: 2 },
		4: {},
		5: {},
		6: { titan: 2, type: GridCellType.Ocean }
	}
}

export const defaultMap = () => {
	const grid = generateGrid(9, 9, (x, y) => preset[y][x])

	const map: MapState = {
		name: 'Standard',
		width: 9,
		height: 9,
		grid,
		special: [],
		initialOceans: 0,
		initialTemperature: -15,
		initialOxygen: 0,
		oceans: 9,
		temperature: 4,
		oxygen: 14,
		temperatureMilestones: [heatAt(-12), heatAt(-10), oceanAt(0)],
		oxygenMilestones: [temperatureAt(8)],
		competitions: [
			CompetitionType.Landlord,
			CompetitionType.Banker,
			CompetitionType.Scientist,
			CompetitionType.Thermalist,
			CompetitionType.Miner
		],
		milestones: [
			MilestoneType.Terraformer,
			MilestoneType.Mayor,
			MilestoneType.Gardener,
			MilestoneType.Builder,
			MilestoneType.Planner
		]
	}

	return map
}
