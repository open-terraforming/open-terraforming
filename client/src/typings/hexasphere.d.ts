declare module 'hexasphere.js' {
	export class Face {
		points: Point[]
	}

	export class Tile {
		centerPoint: Point
		faces: Face[]
		boundary: Point[]

		getLatLon(): {
			lat: number
			lon: number
		}
	}

	export class Point {
		x: number
		y: number
		z: number
	}

	export default class Hexasphere {
		constructor(radius: number, numDivisions: number, hexSize: number)

		tiles: Tile[]

		toJson(): string
		toObj(): string
	}
}
