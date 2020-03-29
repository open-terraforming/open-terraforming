import { PlayerGameState, GameState, UsedCardState } from '../game'

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>

export type Resource = 'money' | 'ore' | 'titan' | 'plants' | 'energy' | 'heat'

export type GameProgress = 'oxygen' | 'temperature' | 'oceans'

export type CardEffectArgumentType = number

export enum CardCategory {
	Science,
	Space,
	Building,
	Microbe,
	Animal,
	Plant,
	Jupiter,
	Power,
	Earth,
	City,
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

	conditions: CardCondition[]
	playEffects: CardEffect[]
	actionEvents: CardEffect[]
	permanentEffects: CardEffect[]
}

export type CardCondition = {
	description?: string
	evaluate: (
		player: PlayerGameState,
		game: GameState,
		card?: UsedCardState
	) => boolean
}

export interface CardEffect {
	args: CardEffectArgument[]
	conditions: CardCondition[]
	description?: string
	perform: (
		player: PlayerGameState,
		game: GameState,
		card: UsedCardState,
		...args: CardEffectArgumentType[]
	) => void
}

export enum CardEffectTarget {
	Player,
	Card,
	AnyCard,
	OtherCard,
}

export interface CardEffectArgument {
	type: CardEffectTarget
	description?: string
	playerConditions: CardCondition[]
}
