import {
	card,
	productionChange,
	productionCondition,
	playerProductionChange,
} from './utils'
import { CardCategory, CardType, Card } from './types'
export * from './types'

export const Cards = [
	card({
		code: 'asteroid_mining',
		title: 'Asteroid mining',
		description: '',
		categories: [CardCategory.Jupiter, CardCategory.Space],
		cost: 30,
		type: CardType.Building,
		victoryPoints: 2,
		playEffects: [productionChange('titan', 2)],
	}),
	card({
		code: 'asteroid_mining_syndicate',
		title: 'Asteroid mining syndicate',
		description: '',
		categories: [CardCategory.Jupiter],
		cost: 13,
		type: CardType.Building,
		victoryPoints: 1,
		conditions: [productionCondition('titan', 1)],
		playEffects: [
			playerProductionChange('titan', -1),
			productionChange('titan', 1),
		],
	}),
] as Card[]

export const CardsLookup = Cards.reduce((acc, c) => {
	acc[c.code] = c
	return acc
}, {} as Record<string, Card | undefined>)
