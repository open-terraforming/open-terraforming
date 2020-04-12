import { GameState, GameStateValue, PlayerState, PlayerStateValue } from '.'
import { defaultMap } from './map'
import { shuffle } from './utils'
import { CardsLookupApi, CardType } from './cards'
import { GameModeType } from './modes/types'

export const initialGameState = (): GameState => ({
	state: GameStateValue.WaitingForPlayers,
	generation: 1,
	mode: GameModeType.Standard,
	currentPlayer: 0,
	startingPlayer: 0,
	players: [],
	oceans: 0,
	oxygen: 0,
	temperature: 0,
	map: defaultMap(),
	competitions: [],
	milestones: [],
	cards: [],
	discarded: [],
	started: new Date().toISOString()
})

export const initialPlayerState = (
	id: number,
	session: string
): PlayerState => ({
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
	cardsPick: [],
	corporation: '',
	spacePriceChange: 0,
	cardPriceChange: 0,
	cardsPickFree: false,
	cardsPickLimit: 0,
	cardsToPlay: [],
	earthPriceChange: 0,
	greeneryCost: 8,
	powerPriceChange: 0,
	powerProjectCost: 11,
	temperatureCost: 8,
	placingTile: [],
	progressConditionBonus: 0,
	name: '<unknown>',
	color: '#000',
	session,
	victoryPoints: []
})
