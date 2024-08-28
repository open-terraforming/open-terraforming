import {
	GridCell,
	GridCellLocation,
	GridCellSpecial,
	GridCellType,
} from '../game'
import { cell } from '../maps/utils'

export const venusExtraCells: GridCell[] = [
	cell({
		enabled: true,
		type: GridCellType.Stratopolis,
		special: GridCellSpecial.Stratopolis,
		outside: true,
		location: GridCellLocation.Venus,
		x: 2,
		y: 2,
	}),
	cell({
		enabled: true,
		type: GridCellType.MaxwellBase,
		special: GridCellSpecial.MaxwellBase,
		outside: true,
		location: GridCellLocation.Venus,
		x: 4,
		y: 2,
	}),
	cell({
		enabled: true,
		type: GridCellType.LunaMetropolis,
		special: GridCellSpecial.LunaMetropolis,
		outside: true,
		location: GridCellLocation.Venus,
		x: 5,
		y: 5,
	}),
	cell({
		enabled: true,
		type: GridCellType.DawnCity,
		special: GridCellSpecial.DawnCity,
		outside: true,
		location: GridCellLocation.Venus,
		x: 5,
		y: 1,
	}),
]
