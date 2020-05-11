import { MapState, GridCellSpecial } from './game'

export enum MapType {
	Standard = 1,
	Hellas,
	Elysium
}

export type MapInfo = {
	type: MapType
	name: string
	build: () => MapState
}

export const LavaCells = [
	GridCellSpecial.TharsisTholus,
	GridCellSpecial.AscraeusMons,
	GridCellSpecial.PavonisMons,
	GridCellSpecial.ArsiaMons,
	GridCellSpecial.OlympusMons,
	GridCellSpecial.HecatesTholus,
	GridCellSpecial.ElysiumMons
]
