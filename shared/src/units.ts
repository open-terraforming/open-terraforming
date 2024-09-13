import { Resource, GameProgress, CardResource } from './cards'
import { quantized } from './utils/quantized'

export const withUnits = (
	res: Resource | GameProgress | CardResource,
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
			return quantized(amount as number, 'plant', 'plants')
		case 'temperature':
			return `${(amount as number) * 2}°C`
		case 'oxygen':
			return `${amount} %`
		case 'venus':
			return `${(amount as number) * 2} %`
		case 'microbes':
			return quantized(amount as number, 'microbe', 'microbes')
		case 'animals':
			return quantized(amount as number, 'animal', 'animals')
		case 'science':
			return quantized(amount as number, 'science', 'sciences')
		case 'fighters':
			return quantized(amount as number, 'fighter', 'fighters')
		case 'floaters':
			return quantized(amount as number, 'floater', 'floaters')
		case 'asteroids':
			return quantized(amount as number, 'asteroid', 'asteroids')
		case 'camps':
			return quantized(amount as number, 'camp', 'camps')
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
