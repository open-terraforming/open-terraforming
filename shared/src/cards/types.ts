import {
	PlayerGameState,
	GameState,
	UsedCardState,
	GridCell,
	PlayerState,
} from '../game'

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>

export type Resource = 'money' | 'ore' | 'titan' | 'plants' | 'energy' | 'heat'

export type CardResource = 'microbes' | 'animals' | 'science' | 'fighters'

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

export interface CellCallbackContext {
	game: GameState
	player: PlayerGameState
	cell: GridCell
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

	resource?: CardResource
	conditions: CardCondition[]
	playEffects: CardEffect[]
	actionEffects: CardEffect[]
	passiveEffects: CardPassiveEffect[]

	victoryPointsCallback?: CardVictoryPointsCallback
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CardCondition<T extends CardEffectArgumentType[] = any> = {
	description?: string
	evaluate: (ctx: CardCallbackContext, ...args: T) => boolean
}

export type PlayerCondition = {
	description?: string
	evaluate: (ctx: PlayerCallbackContext) => boolean
}

export type CellCondition = {
	description?: string
	evaluate: (ctx: CellCallbackContext) => boolean
}

export enum CardEffectType {
	Production,
	Resource,
	Other,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CardEffect<T extends Array<CardEffectArgumentType> = any> {
	args: CardEffectArgument[]
	conditions: CardCondition[]
	description?: string
	type: CardEffectType
	perform: (ctx: CardCallbackContext, ...args: T) => void
}

export enum CardEffectTarget {
	// Type - player: number
	Player,
	// Type - amount: number
	Resource,
	// Type - cardIndex: number
	Card,
	// Type - [player: number, cardIndex: number]
	PlayerCardResource,
	// Type - codes: string[]
	DrawnCards,
	// Type - [choice: number, choiceParams: any[]]
	EffectChoice,
	// Type - [x: number, y: number]
	Cell,
}

export interface CardEffectArgument {
	type: CardEffectTarget
	description?: string
	playerConditions: PlayerCondition[]
	cardConditions: CardCondition[]
	cellConditions: CellCondition[]
	drawnCards?: number
	amount?: number
	maxAmount?: number
	optional: boolean
	resource?: Resource
	effects?: CardEffect[]
}

export interface CardPassiveEffect {
	description: string
	choice?: CardPassiveEffect[]
	onTilePlaced?: (
		ctx: CardCallbackContext,
		cell: GridCell,
		placedBy: PlayerState
	) => void
	onCardPlayed?: (
		ctx: CardCallbackContext,
		playedCard: Card,
		playedCardIndex: number,
		playedBy: PlayerState
	) => void
}
