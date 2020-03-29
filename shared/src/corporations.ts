export interface Corporation {
	code: string
	name: string

	startingMoney: number
	startingOre: number
	startingTitan: number
	startingHeat: number
	startingPlants: number
	startingEnergy: number
}

const corp = (c: Corporation) => c

export const Corporations = [
	corp({
		code: 'general',
		name: 'General Corporation',
		startingMoney: 45,
		startingEnergy: 0,
		startingHeat: 0,
		startingOre: 0,
		startingPlants: 0,
		startingTitan: 0,
	}),
]
