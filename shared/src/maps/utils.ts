import { WithOptional } from '../cards'
import {
	ProgressMilestoneItem,
	ProgressMilestoneType,
	GridCell,
	GridCellType
} from '../game'
import { MapInfo } from '../map'

export const milestoneItem = (
	m: WithOptional<ProgressMilestoneItem, 'used'>
): ProgressMilestoneItem => ({ ...m, used: false })

export const heatAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Heat,
		value
	})

export const temperatureAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Temperature,
		value
	})

export const oceanAt = (value: number) =>
	milestoneItem({
		type: ProgressMilestoneType.Ocean,
		value
	})

export const mapInfo = (c: MapInfo) => c

export const cell = (c: Partial<GridCell>): GridCell => ({
	x: -1,
	y: -1,
	enabled: true,
	type: GridCellType.General,
	cards: 0,
	ore: 0,
	plants: 0,
	titan: 0,
	heat: 0,
	oceans: 0,
	money: 0,
	outside: false,
	...c
})

export const generateGrid = (
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
