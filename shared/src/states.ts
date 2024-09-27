import {
	GameState,
	GameStateValue,
	PlayerState,
	PlayerStateValue,
	StandardProjectState,
	StandardProjectType,
} from '.'
import { CardCategory } from './cards'
import { MapType } from './map'
import { Maps } from './maps'
import { GameModeType } from './modes/types'
import { ExpansionType } from './expansions/types'

export const initialGameState = (
	id = 'game',
	map = MapType.Standard,
): GameState => ({
	id,
	name: 'Standard Game',
	state: GameStateValue.WaitingForPlayers,
	generation: 1,
	mode: GameModeType.Standard,
	currentPlayer: 0,
	startingPlayer: 0,
	players: [],
	oceans: 0,
	oxygen: 0,
	temperature: 0,
	venus: 0,
	prelude: false,
	draft: false,
	map: Maps[map].build(),
	competitions: [],
	milestones: [],
	cards: [],
	discarded: [],
	preludeCards: [],
	preludeDiscarded: [],
	corporations: [],
	corporationsDiscarded: [],
	started: new Date().toISOString(),
	ended: '',
	maxPlayers: 5,
	cardPrice: 3,
	milestonePrice: 8,
	milestoneReward: 5,
	milestonesLimit: 3,
	competitionsLimit: 3,
	competitionsPrices: [8, 14, 20],
	competitionRewards: [5, 2],
	expansions: [ExpansionType.Base],
	wgTerraforming: true,
	standardProjects: [
		initialStandardProjectState(StandardProjectType.SellPatents),
		initialStandardProjectState(StandardProjectType.PowerPlant),
		initialStandardProjectState(StandardProjectType.Asteroid),
		initialStandardProjectState(StandardProjectType.Aquifer),
		initialStandardProjectState(StandardProjectType.Greenery),
		initialStandardProjectState(StandardProjectType.City),
		initialStandardProjectState(StandardProjectType.GreeneryForPlants),
		initialStandardProjectState(StandardProjectType.TemperatureForHeat),
	],
	colonies: [],
	colonyCards: [],
	events: [],
})

export const initialPlayerState = (id = 0, session = ''): PlayerState => ({
	connected: false,
	id,
	bot: false,
	admin: false,
	owner: false,
	actionsPlayed: 0,
	energy: 0,
	energyProduction: 0,
	heat: 0,
	heatProduction: 0,
	money: 0,
	moneyProduction: 0,
	ore: 0,
	oreProduction: 0,
	orePrice: 2,
	titan: 0,
	titanProduction: 0,
	titanPrice: 3,
	plants: 0,
	plantsProduction: 0,
	state: PlayerStateValue.Connecting,
	terraformRating: 20,
	cards: [],
	draftedCards: [],
	usedCards: [],
	corporation: '',
	tagPriceChange: {} as Record<CardCategory, number>,
	cardPriceChange: 0,
	greeneryCost: 8,
	powerProjectCost: 11,
	temperatureCost: 8,
	progressConditionBonus: 0,
	progressConditionBonusByTag: {},
	name: '<unknown>',
	color: '',
	session,
	victoryPoints: [],
	pendingActions: [],
	protectedHabitat: false,
	tradeFleets: 1,
	colonyTradeResourceCostChange: 0,
})

export const initialStandardProjectState = (
	type: StandardProjectType,
): StandardProjectState => ({
	type,
	usedByPlayerIds: [],
})
