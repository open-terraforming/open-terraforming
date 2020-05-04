import { GameState, GameStateValue, PlayerState, PlayerStateValue } from '.'
import { CardCategory } from './cards'
import { MapType } from './map'
import { Maps } from './maps'
import { GameModeType } from './modes/types'

export const initialGameState = (
	id = 'game',
	map = MapType.Standard
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
	prelude: true,
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
	maxPlayers: 5
})

export const initialPlayerState = (id = 0, session = ''): PlayerState => ({
	connected: false,
	id,
	bot: false,
	admin: false,
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
	usedCards: [],
	corporation: '',
	tagPriceChange: {} as Record<CardCategory, number>,
	cardPriceChange: 0,
	greeneryCost: 8,
	powerProjectCost: 11,
	temperatureCost: 8,
	progressConditionBonus: 0,
	name: '<unknown>',
	color: '',
	session,
	victoryPoints: [],
	pendingActions: [],
	protectedHabitat: false
})
