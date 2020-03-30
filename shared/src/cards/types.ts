import { PlayerGameState, GameState, UsedCardState } from '../game'

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>

export type Resource = 'money' | 'ore' | 'titan' | 'plants' | 'energy' | 'heat'

export type CardResource = 'science' | 'animals' | 'science'

export type GameProgress = 'oxygen' | 'temperature' | 'oceans'

export type CardEffectArgumentType = number | string | CardEffectArgumentType[]

export interface CardCallbackContext {
	game: GameState
	player: PlayerGameState
	playerId: number
	card: UsedCardState
	cardIndex: number
}

export interface PlayerCallbackContext {
	game: GameState
	player: PlayerGameState
}

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

export interface CardVictoryPointsCallback {
	description: string
	compute: (ctx: CardCallbackContext) => number
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

	victoryPointsCallback?: CardVictoryPointsCallback
}

export type CardCondition = {
	description?: string
	evaluate: (ctx: CardCallbackContext) => boolean
}

export type PlayerCondition = {
	description?: string
	evaluate: (ctx: PlayerCallbackContext) => boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CardEffect<T extends Array<CardEffectArgumentType> = any> {
	args: CardEffectArgument[]
	conditions: CardCondition[]
	description?: string
	perform: (ctx: CardCallbackContext, ...args: T) => void
}

export enum CardEffectTarget {
	Player,
	PlayerResource,
	Card,
	AnyCard,
	OtherCard,
	DrawnCards,
	Resource,
}

export interface CardEffectArgument {
	type: CardEffectTarget
	description?: string
	playerConditions: PlayerCondition[]
	drawnCards?: number
	amount?: number
	maxAmount?: number
	resource?: Resource
}
