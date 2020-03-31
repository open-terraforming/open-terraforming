import { Resource, GameProgress } from './cards'
import { ucFirst } from './utils'

export const withUnits = (res: Resource, amount: number | string) => {
	switch (res) {
		case 'money':
			return `${amount} $`
		case 'energy':
			return `${amount} energy`
		case 'heat':
			return `${amount} heat`
		case 'ore':
			return `${amount} ore`
		case 'titan':
			return `${amount} titan`
		case 'plants':
			return `${amount} plants`
		default:
			return amount
	}
}

export const progressResToStr = (res: GameProgress) => ucFirst(res)
