import {
	PlayerGameState,
	GameState,
	UsedCardState,
	GridCell,
	PlayerState,
	GridCellContent,
	GridCellOther
} from '../game'
import { StandardProject } from '../projects'

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>

export type Resource = 'money' | 'ore' | 'titan' | 'plants' | 'energy' | 'heat'
export type Production =
	| 'moneyProduction'
	| 'oreProduction'
	| 'titanProduction'
	| 'plantsProduction'
	| 'energyProduction'
	| 'heatProduction'

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
	Science = 1,
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
	Any
}

export enum CardType {
	Event = 1,
	Action,
	Effect,
	Building,
	Corporation,
	Prelude
}

export enum CardSpecial {
	CorporationsEra = 1,
	StartingCorporation,
	Prelude
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
	special: CardSpecial[]

	resource?: CardResource
	resourceProtected?: boolean

	conditions: CardCondition[]
	playEffects: CardEffect[]
	actionEffects: CardEffect[]
	passiveEffects: CardPassiveEffect[]

	victoryPointsCallback?: CardVictoryPointsCallback
}

export type CardCondition<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (CardEffectArgumentType | undefined)[] = any
> = {
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
	Production = 1,
	Resource,
	Other
}

export interface CardEffect<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Array<CardEffectArgumentType | undefined> = any
> {
	args: CardEffectArgument[]
	conditions: CardCondition[]
	description?: string
	type: CardEffectType
	symbols: CardSymbol[]
	perform: (ctx: CardCallbackContext, ...args: T) => void
}

export enum CardEffectTarget {
	// Type - player: number
	Player = 1,
	// Type - [player: number, amount: number]
	PlayerResource,
	// Type - amount: number
	Resource,
	// Type - cardIndex: number
	Card,
	// Type - [player: number, cardIndex: number]
	PlayerCardResource,
	// Type - [choice: number, choiceParams: any[]]
	EffectChoice,
	// Type - [x: number, y: number]
	Cell
}

export interface CardEffectArgument {
	type: CardEffectTarget
	descriptionPrefix?: string
	descriptionPostfix?: string
	playerConditions: PlayerCondition[]
	cardConditions: CardCondition[]
	cellConditions: CellCondition[]
	drawnCards?: number
	amount?: number
	maxAmount?: number
	optional: boolean
	resource?: Resource
	production?: Production
	fromHand?: boolean
	effects?: CardEffect[]
}

export interface CardPassiveEffect {
	description: string
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
	onStandardProject?: (
		ctx: CardCallbackContext,
		project: StandardProject,
		playedBy: PlayerState
	) => void
	onGenerationEnd?: (ctx: CardCallbackContext) => void
}

export enum SymbolType {
	Plus = 1,
	Minus,
	Slash,
	Card,
	TerraformingRating,
	RightArrow,
	Temperature,
	Oxygen
}

export interface CardSymbol {
	count?: number
	symbol?: SymbolType
	resource?: Resource
	production?: boolean
	other?: boolean
	tile?: GridCellContent
	tileOther?: GridCellOther
}
