import { Resource, GameProgress } from './cards'

export const withUnits = (
	res: Resource | GameProgress,
	amount: number | string,
) => {
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
		case 'temperature':
			return `${(amount as number) * 2}°C`
		case 'oxygen':
			return `${amount} %`
		case 'venus':
			return `${(amount as number) * 2} steps`
		default:
			return amount.toString()
	}
}

export const progressResToStr = (res: GameProgress) => {
	switch (res) {
		case 'oceans':
			return 'Oceans'
		case 'oxygen':
			return 'Oxygen'
		case 'temperature':
			return 'Temperature'
		case 'venus':
			return 'Venus'
	}
}
