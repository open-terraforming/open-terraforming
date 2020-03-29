type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export enum CardCategory {
	Science,
	Space,
	Building,
	Microbes,
	Animals,
	Plants,
	Jupiter,
	Energy,
	Earth,
	Town,
	Event,
}

export enum CardType {
	Event,
	Action,
	Effect,
	Building,
}

export interface Card {
	code: string
	title: string
	description: string
	type: CardType
	categories: CardCategory[]
	cost: number
	victoryPoints: number

	minHeat?: number
	maxHeat?: number
	minOxygen?: number
	maxOxygen?: number
	minOceans?: number
	maxOceans?: number
}

const card = (c: WithOptional<Card, 'victoryPoints'>) =>
	({
		victoryPoints: 0,
		...c,
	} as Card)

export const Cards = [
	card({
		code: 'asteroid_mining',
		title: 'Těžba na asteroidu',
		description: '',
		categories: [CardCategory.Jupiter, CardCategory.Space],
		cost: 30,
		type: CardType.Building,
		victoryPoints: 2,
	}),
] as Card[]

export const CardsLookup = Cards.reduce((acc, c) => {
	acc[c.code] = c
	return acc
}, {} as Record<string, Card | undefined>)
