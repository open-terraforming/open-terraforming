import { CardCategory } from './cards'
import { CompetitionType } from './competitions'
import { MilestoneType } from './milestones'
import { GameModeType } from './modes/types'
import { PlayerAction } from './player-actions'
import { MapType } from './map'
import { ExpansionType } from './expansions/types'

export enum GameStateValue {
	/** Waiting for all players to connect */
	WaitingForPlayers = 1,
	/** Players are picking companies / cards / preludes */
	Starting,
	/** Generation is starting */
	GenerationStart,
	/** Generation is in progress */
	GenerationInProgress,
	/** Production phase */
	GenerationEnding,
	/** Players are placing finishing greeneries */
	EndingTiles,
	/** Game ended */
	Ended,
	/** Players are picking cards to research */
	ResearchPhase,
	/** Players are picking cards to pick from to research (optional) */
	Draft,
	/** Players are playing their prelude cards */
	Prelude,
	/** After production phase this phase allows the current player to increase one progress */
	SolarPhase,
}

export enum PlayerStateValue {
	/** Is in progress of connecting */
	Connecting = 1,
	/** Waiting for other players */
	Waiting,
	/** Player is picking (in the beginning of the game) */
	Picking,
	/** Ready to start the game */
	Ready,
	/** Currently playing his round */
	Playing,
	/** Passed his round */
	Passed,
	/** Placing finishing greeneries */
	EndingTiles,
	/** Waiting for his turn */
	WaitingForTurn,
	/** Playing prelude cards */
	Prelude,
	/** Picking what to terraform during the Solar Phase */
	SolarPhaseTerraform,
}

export interface GameState {
	id: string
	name: string
	state: GameStateValue
	mode: GameModeType
	generation: number
	oxygen: number
	oceans: number
	temperature: number
	venus: number
	map: MapState

	/** Is solar phase enabled */
	solarPhase: boolean

	/**  Player index (NOT ID) currently playing round (only for GenerationInProgress) */
	currentPlayer: number
	/**  Player index (NOT ID) of player starting current generation */
	startingPlayer: number

	players: PlayerState[]
	maxPlayers: number

	corporations: string[]
	corporationsDiscarded: string[]

	cards: string[]
	discarded: string[]

	prelude: boolean
	preludeCards: string[]
	preludeDiscarded: string[]

	draft: boolean

	expansions: ExpansionType[]

	/** ISO Date of game start */
	started: string
	/** ISO Date of game end */
	ended: string

	/** Basic card price, in money, for buying card to your hand */
	cardPrice: number

	/** List of bought milestones */
	milestones: MilestoneState[]
	/** Basic milestone price, in money */
	milestonePrice: number
	/** Victory points received milestone */
	milestoneReward: number
	/** Maximum number of milestones bought */
	milestonesLimit: number

	/** List of sponsored competitions */
	competitions: CompetitionState[]
	/** Maximum number of sponsored competitions */
	competitionsLimit: number
	/** List of competitions prices, index is number of bought competitions */
	competitionsPrices: number[]
	/** Victory points received for placing in competition, index is place in competition */
	competitionRewards: number[]

	/** Available standard projects */
	standardProjects: StandardProjectType[]
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
	code: MapType

	width: number
	height: number

	oceans: number
	temperature: number
	oxygen: number
	venus: number

	initialOceans: number
	initialTemperature: number
	initialOxygen: number
	initialVenus: number

	grid: GridCell[][]

	temperatureMilestones: ProgressMilestoneItem[]
	oxygenMilestones: ProgressMilestoneItem[]
	venusMilestones: ProgressMilestoneItem[]

	milestones: MilestoneType[]
	competitions: CompetitionType[]
}

export enum GridCellType {
	Ocean = 1,
	General,
	NoctisCity,
	GanymedeColony,
	PhobosSpaceHaven,
	Stratopolis,
	MaxwellBase,
	DawnCity,
	LunaMetropolis,
}

export enum GridCellSpecial {
	NoctisCity = 1,
	TharsisTholus,
	AscraeusMons,
	PavonisMons,
	ArsiaMons,
	GanymedeColony,
	PhobosSpaceHaven,
	HecatesTholus,
	ElysiumMons,
	OlympusMons,
	MaxwellBase,
	Stratopolis,
	DawnCity,
	LunaMetropolis,
}

export enum GridCellContent {
	City = 1,
	Forest,
	Ocean,
	Other,
}

export enum GridCellOther {
	Capital = 1,
	NaturalPreserve,
	Mine,
	CommercialDistrict,
	NuclearZone,
	IndustrialCenter,
	EcologicalZone,
	Volcano,
	Mohole,
	RestrictedZone,
}

export enum GridCellLocation {
	Main = 1,
	Venus,
}

export interface GridCell {
	enabled: boolean
	type: GridCellType
	special?: GridCellSpecial
	location?: GridCellLocation

	ore: number
	titan: number
	plants: number
	cards: number
	heat: number
	money: number
	oceans: number

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

	owner: boolean
	admin: boolean

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
	/** Price change for specific tags */
	tagPriceChange: Record<CardCategory, number | undefined>

	/** Cost of greenery in plants */
	greeneryCost: number
	/** Cost of temperature increase in heat */
	temperatureCost: number
	/** Cost of standard power project in money */
	powerProjectCost: number

	/** Player TR */
	terraformRating: number

	/**  Number of actions played this round */
	actionsPlayed: number

	/** Cards in player hand */
	cards: string[]

	/** Cards picked during draft */
	draftedCards: string[]

	/** List of used cards */
	usedCards: UsedCardState[]

	/** Bonus for game progress changes */
	progressConditionBonus: number

	/** Bonus for game progress changes restricted to specific card tag */
	progressConditionBonusByTag: Partial<Record<CardCategory, number>>

	victoryPoints: VictoryPoints[]

	/** Pending actions to be played by the player */
	pendingActions: PlayerAction[]

	/** Protects plants/microbes/animals */
	protectedHabitat: boolean
}

export enum VictoryPointsSource {
	Rating = 1,
	Cards,
	Milestones,
	Awards,
	Forests,
	Cities,
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
	/** Index in used card list */
	index: number

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
	/** Floaters */
	floaters: number
	/** Asteroids */
	asteroids: number

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
	TemperatureForHeat,
	AirScrapping,
}

export enum ProgressMilestoneType {
	Ocean = 1,
	Heat,
	Temperature,
	Card,
	TerraformingRating,
}

export interface ProgressMilestoneItem {
	type: ProgressMilestoneType
	value: number
	used: boolean
}
