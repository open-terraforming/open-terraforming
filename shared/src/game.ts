import { PlacementState } from './placements'
import { MilestoneType, Milestones } from './milestones'
import { CompetitionType } from './competitions'

export enum GameStateValue {
	/** Waiting for all players to connect */
	WaitingForPlayers = 1,
	/**  Players are picking companies */
	PickingCorporations,
	/** Players are picking cards */
	PickingCards,
	/**  Players are picking their cards */
	GenerationStart,
	/**  Generation is in progress */
	GenerationInProgress,
	/**  Game ended */
	Ended
}

export enum PlayerStateValue {
	/**  Is in progress of connecting */
	Connecting = 1,
	/**  Waiting for other players */
	Waiting,
	/** Player is picking corporation */
	PickingCorporation,
	/**  Player is picking cards */
	PickingCards,
	/**  Ready to start the game */
	Ready,
	/**  Currently playing his round */
	Playing,
	/**  Passed his round */
	Passed,
	/**  Waiting for his turn */
	WaitingForTurn
}

export interface GameState {
	state: GameStateValue

	generation: number
	oxygen: number
	oceans: number
	temperature: number

	/**  Player index (NOT ID) currently playing round (only for GenerationInProgress) */
	currentPlayer: number

	startingPlayer: number

	players: PlayerState[]

	map: MapState

	milestones: MilestoneState[]
	competitions: CompetitionState[]

	cards: string[]
	discarded: string[]

	/** ISO Date of game start */
	started: string
}

export interface MilestoneState {
	type: MilestoneType
	playerId: number
}

export interface CompetitionState {
	type: CompetitionType
	playerId: number
}

export interface MapState {
	width: number
	height: number

	oceans: number
	temperature: number
	oxygen: number

	initialOceans: number
	initialTemperature: number
	initialOxygen: number

	special: GridCell[]
	grid: GridCell[][]

	temperatureMilestones: ProgressMilestoneItem[]
	oxygenMilestones: ProgressMilestoneItem[]
}

export enum GridCellType {
	Ocean = 1,
	General,
	NoctisCity,
	GanymedeColony,
	PhobosSpaceHaven
}

export enum GridCellSpecial {
	NoctisCity = 1,
	TharsisTholus,
	AscraeusMons,
	PavonisMons,
	ArsiaMons,
	GanymedeColony,
	PhobosSpaceHaven
}

export enum GridCellContent {
	City = 1,
	Forest,
	Ocean,
	Other
}

export enum GridCellOther {
	Capital = 1,
	Mars,
	Mine,
	CommercialDistrict,
	NuclearZone,
	IndustrialCenter,
	EcologicalZone,
	Volcano,
	Mohole,
	Restricted
}

export interface GridCell {
	enabled: boolean
	type: GridCellType
	special?: GridCellSpecial
	ore: number
	titan: number
	plants: number
	cards: number
	x: number
	y: number
	outside: boolean

	content?: GridCellContent
	other?: GridCellOther

	ownerId?: number
	ownerCard?: number

	claimantId?: number
}

export interface PlayerState {
	id: number
	name: string
	color: string
	session: string
	connected: boolean
	bot: boolean

	state: PlayerStateValue

	/** Code of player corporation */
	corporation: string

	// Resources
	money: number
	moneyProduction: number
	ore: number
	oreProduction: number
	orePrice: number
	titan: number
	titanProduction: number
	titanPrice: number
	plants: number
	plantsProduction: number
	energy: number
	energyProduction: number
	heat: number
	heatProduction: number

	/** General card price change */
	cardPriceChange: number
	/** Space card price change */
	spacePriceChange: number
	/** Earth card price change */
	earthPriceChange: number
	/** Power card price change */
	powerPriceChange: number

	/** Player TR */
	terraformRating: number

	/**  Number of actions played this round */
	actionsPlayed: number

	/** Cards in player hand */
	cards: string[]

	/** List of used cards */
	usedCards: UsedCardState[]

	/** List of cards to pick from */
	cardsPick: string[]
	cardsPickLimit: number
	cardsPickFree: boolean

	/** Is placing a tile */
	placingTile: PlacementState[]

	/** List of cards that are to be played - index in usedCards */
	cardsToPlay: number[]

	/** Cost of greenery in plants */
	greeneryCost: number
	/** Cost of temperature increase in heat */
	temperatureCost: number
	/** Cost of standard power project in money */
	powerProjectCost: number

	/** Bonus for game progress changes */
	progressConditionBonus: number

	victoryPoints: VictoryPoints[]
}

export enum VictoryPointsSource {
	Rating = 1,
	Cards,
	Milestones,
	Awards,
	Forests,
	Cities
}

export type VictoryPoints = {
	source: VictoryPointsSource
	amount: number
	competition?: CompetitionType
	milestone?: MilestoneType
}

export type PlayerGameState = PlayerState

export interface UsedCardState {
	/** Used car code */
	code: string
	/** Was the card played this generation */
	played: boolean

	/** Number of microbes on the card */
	microbes: number
	/** Number of animals on the card */
	animals: number
	/** Number of science points on the card */
	science: number
	/** Number of fighter points on the card */
	fighters: number

	/** Index of card that triggered last passive effect */
	triggeredByCard?: number

	/** Extra data used by card effects to save something */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any
}

export enum StandardProjectType {
	SellPatents = 1,
	PowerPlant,
	Asteroid,
	Aquifer,
	Greenery,
	City,
	GreeneryForPlants,
	TemperatureForHeat
}

export enum ProgressMilestoneType {
	Ocean = 1,
	Heat,
	Temperature
}

export interface ProgressMilestoneItem {
	type: ProgressMilestoneType
	value: number
	used: boolean
}
