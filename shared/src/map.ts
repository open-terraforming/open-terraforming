import { MapState } from './game'

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
