import {
	PlayerGameState,
	GameState,
	UsedCardState,
	GridCell,
	PlayerState,
	GridCellContent,
	GridCellOther,
	ColonyState,
	CommitteePartyState,
} from '../gameState'
import { StandardProject } from '../projects'
import { CardHint } from './cardHints'

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

export type CardResource =
	| 'microbes'
	| 'animals'
	| 'science'
	| 'fighters'
	| 'floaters'
	| 'asteroids'
	| 'camps'

export type GameProgress = 'oxygen' | 'temperature' | 'oceans' | 'venus'

export type CardEffectArgumentType = number | string | CardEffectArgumentType[]

export interface CardCallbackContext {
	game: GameState
	player: PlayerGameState
	card: UsedCardState
	/** used by joinedEffects, includes all args sent to the action */
	allArgs?: unknown[]
	/** used for playEffect, it's the index in players hand */
	cardHandIndex?: number
}

export interface PlayerCallbackContext {
	game: GameState
	player: PlayerGameState
	card: UsedCardState
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
	Venus,
	Any,
}

export enum CardType {
	Event = 1,
	Action,
	Effect,
	Building,
	Corporation,
	Prelude,
}

export enum CardSpecial {
	CorporationsEra = 1,
	StartingCorporation,
	Prelude,
	Venus,
	Colonies,
	Turmoil,
}

export interface CardVictoryPointsCallback {
	description: string
	hints?: CardHint[]
	compute: (ctx: CardCallbackContext) => number
}

export interface Card {
	code: string
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

	resourcesUsableAsMoney?: {
		amount: number
		categories?: CardCategory[]
	}
}

export type CardCondition<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (CardEffectArgumentType | undefined)[] = any,
> = {
	description?: string
	symbols: CardSymbol[]
	hints?: CardHint[]
	evaluate: (ctx: CardCallbackContext, ...args: T) => boolean
}

export type PlayerCondition = {
	description?: string
	symbols: CardSymbol[]
	evaluate: (ctx: PlayerCallbackContext) => boolean
}

export type CellCondition = {
	description?: string
	evaluate: (ctx: CellCallbackContext) => boolean
}

export enum CardEffectType {
	Production = 1,
	Resource,
	Other,
}

export interface CardEffect<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Array<CardEffectArgumentType | undefined> = any,
> {
	args: CardEffectArgument[]
	conditions: CardCondition[]
	description?: string
	type: CardEffectType
	symbols: CardSymbol[]
	aiScore: number | ((ctx: CardCallbackContext) => number)
	hints?: CardHint[]
	perform: (ctx: CardCallbackContext, ...args: T) => void
}

export enum CardEffectTarget {
	// Type - player: number
	Player = 1,
	// Type - [player: number, amount: number]
	PlayerResource,
	// Type - amount: number
	Resource,
	// Type - resource: Resource
	ResourceType,
	// Type - amount: number
	Production,
	// Type - cardIndex: number
	Card,
	// Type - [player: number, cardIndex: number]
	PlayerCardResource,
	// Type - [choice: number, choiceParams: any[]]
	EffectChoice,
	// Type - [x: number, y: number]
	Cell,
	// Type - amount: number
	CardResourceCount,
	// Type - partyCode: string
	CommitteeParty,
	// Type - [partyCode: string, memberPlayerId: number | null]
	CommitteePartyMember,
}

export interface CardEffectArgument {
	type: CardEffectTarget
	descriptionPrefix?: string
	descriptionPostfix?: string
	playerConditions: PlayerCondition[]
	cardConditions: CardCondition[]
	cellConditions: CellCondition[]
	resourceConditions: ResourceCondition[]
	committeePartyConditions?: CommitteePartyCondition[]
	drawnCards?: number
	amount?: number
	maxAmount?: number | MaxAmountCallback
	optional: boolean
	resource?: Resource
	production?: Production
	fromHand?: boolean
	effects?: CardEffect[]
	minAmount?: number
	/** Allow selecting the card being played as the target - used for CARD inside playEffects */
	allowSelfCard?: boolean
	skipCurrentCard?: boolean
}

export type MaxAmountCallback = (ctx: CardCallbackContext) => number

export type ResourceCondition = (
	context: { player: PlayerState; game: GameState },
	resource: Resource,
) => boolean

export type CommitteePartyCondition = (
	context: { player: PlayerState; game: GameState },
	committeeParty: CommitteePartyState,
) => boolean

export interface CardPassiveEffect {
	description: string
	symbols: CardSymbol[]
	/** Triggered when card is played from hand */
	onPlay?: (ctx: CardCallbackContext) => void
	onGenerationStarted?: (ctx: CardCallbackContext, generation: number) => void
	onTilePlaced?: (
		ctx: CardCallbackContext,
		cell: GridCell,
		placedBy: PlayerState,
	) => void
	onCardBought?: (
		ctx: CardCallbackContext,
		playedCard: Card,
		playedCardIndex: number,
		playedBy: PlayerState,
		moneyCost: number,
	) => void
	onStandardProject?: (
		ctx: CardCallbackContext,
		project: StandardProject,
		playedBy: PlayerState,
	) => void
	onProgress?: (ctx: CardCallbackContext, progress: GameProgress) => void
	onGenerationEnd?: (ctx: CardCallbackContext) => void
	onPlayerProductionChanged?: (
		ctx: CardCallbackContext,
		player: PlayerState,
		production: Production,
		change: number,
	) => void
	onBeforeColonyTrade?: (
		ctx: CardCallbackContext,
		tradingPlayer: PlayerState,
		colony: ColonyState,
	) => void
	onColonyBuilt?: (
		ctx: CardCallbackContext,
		builtBy: PlayerState,
		colony: ColonyState,
	) => void
}

export enum SymbolType {
	Plus = 1,
	Minus,
	Slash,
	Card,
	TerraformingRating,
	RightArrow,
	Temperature,
	Oxygen,
	X,
	Colon,
	LessOrEqual,
	MoreOrEqual,
	Venus,
	AnyResource,
	Equal,
	CardWithNoTag,
	ColonyTrade,
	Colony,
	TradeFleet,
	SlashSmall,
	BigPlus,
	Player,
	Influence,
	BlueCard,
	Tile,
	Delegate,
	Chairman,
	PartyLeader,
}

export interface CardSymbol {
	count?: number
	symbol?: SymbolType
	resource?: Resource
	cardResource?: CardResource
	production?: boolean
	other?: boolean
	tile?: GridCellContent
	tileOther?: GridCellOther
	tag?: CardCategory
	text?: string
	forceSign?: boolean
	forceCount?: boolean
	color?: string
	title?: string
	noRightSpacing?: boolean
	affectedByInfluence?: boolean
	committeeParty?: string
}
