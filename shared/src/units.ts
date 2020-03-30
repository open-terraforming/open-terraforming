import { Resource } from './cards'

export const withUnits = (res: Resource, amount: number | string) => {
	switch (res) {
		case 'money':
			return `${amount} $`
		case 'energy':
			return `${amount} of energy`
		case 'heat':
			return `${amount} of heat`
		case 'ore':
			return `${amount} of ore`
		case 'titan':
			return `${amount} of titan`
		case 'plants':
			return `${amount} of plants`
		default:
			return amount
	}
}
