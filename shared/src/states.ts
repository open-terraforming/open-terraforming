import { GameState, GameStateValue, PlayerState, PlayerStateValue } from '.'
import { defaultMap } from './map'
import { shuffle } from './utils'
import { CardsLookupApi, CardType } from './cards'

export const initialGameState = (): GameState => ({
	state: GameStateValue.WaitingForPlayers,
	generation: 1,
	currentPlayer: 0,
	startingPlayer: 0,
	players: [],
	oceans: 0,
	oxygen: 0,
	temperature: 0,
	map: defaultMap(),
	competitions: [],
	milestones: [],
	cards: shuffle(
		Object.values(CardsLookupApi.data())
			.filter(c => c.type !== CardType.Corporation)
			.map(c => c.code)
	),
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
	actionsPlayed: 0,
	energy: 0,
	energyProduction: 1,
	heat: 0,
	heatProduction: 1,
	money: 0,
	moneyProduction: 1,
	ore: 0,
	oreProduction: 1,
	orePrice: 2,
	titan: 0,
	titanProduction: 1,
	titanPrice: 3,
	plants: 0,
	plantsProduction: 1,
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
	name: '<unknown>',
	color: '#000',
	session
})
