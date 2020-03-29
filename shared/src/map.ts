import { MapState, GridField, GridFieldType, GridFieldSpecial } from './game'

const generateGrid = (
	w: number,
	h: number,
	cb: (x: number, y: number) => Partial<GridField> | undefined
) => {
	const grid = [] as GridField[][]
	for (let x = 0; x < w; x++) {
		const col = [] as GridField[]
		for (let y = 0; y < h; y++) {
			const update = cb(x, y)
			col.push({
				x,
				y,
				enabled: !!update,
				type: GridFieldType.General,
				cards: 0,
				ore: 0,
				plants: 0,
				titan: 0,
				...update,
			})
		}
		grid.push(col)
	}
	return grid
}

const preset: Record<number, Record<number, Partial<GridField>>> = {
	0: {
		2: { ore: 2 },
		3: { ore: 2 },
		4: {},
		5: { cards: 1, type: GridFieldType.Ocean },
		6: { type: GridFieldType.Ocean },
	},
	1: {
		1: {},
		2: { ore: 1, special: GridFieldSpecial.TharsisTholus },
		3: {},
		4: {},
		5: {},
		6: { cards: 2, type: GridFieldType.Ocean },
	},
	2: {
		1: { cards: 1, special: GridFieldSpecial.AscraeusMons },
		2: {},
		3: {},
		4: {},
		5: {},
		6: {},
		7: { ore: 1 },
	},
	3: {
		0: { plants: 1, titan: 1, special: GridFieldSpecial.PavonisMons },
		1: { plants: 1 },
		2: { plants: 1 },
		3: { plants: 1 },
		4: { plants: 2 },
		5: { plants: 1 },
		6: { plants: 1 },
		7: { plants: 2, type: GridFieldType.Ocean },
	},
	4: {
		0: { plants: 2, special: GridFieldSpecial.ArsiaMons },
		1: { plants: 2 },
		2: {
			plants: 2,
			type: GridFieldType.NoctisCity,
			special: GridFieldSpecial.NoctisCity,
		},
		3: { plants: 2, type: GridFieldType.Ocean },
		4: { plants: 2, type: GridFieldType.Ocean },
		5: { plants: 2, type: GridFieldType.Ocean },
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
		5: { plants: 1, type: GridFieldType.Ocean },
		6: { plants: 1, type: GridFieldType.Ocean },
		7: { plants: 1, type: GridFieldType.Ocean },
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
		2: { ore: 1 },
		3: { ore: 2 },
		4: {},
		5: {},
		6: { titan: 2, type: GridFieldType.Ocean },
	},
}

export const defaultMap = () => {
	const grid = generateGrid(9, 9, (x, y) => preset[y][x])
	const map = {
		width: 9,
		height: 9,
		grid,
	} as MapState

	return map
}
