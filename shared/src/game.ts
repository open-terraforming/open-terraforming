export enum GameStateValue {
	/** Waiting for all players to connect */
	WaitingForPlayers,
	/**  Players are picking companies */
	PickingCorporations,
	/** Players are picking cards */
	PickingCards,
	/**  Players are picking their cards */
	GenerationStart,
	/**  Generation is in progress */
	GenerationInProgress,
	/**  Game ended */
	Ended,
}

export enum PlayerStateValue {
	/**  Is in progress of connecting */
	Connecting,
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
	WaitingForTurn,
	/** Is placing tile */
	PlacingTile,
}

export interface GameState {
	state: GameStateValue

	generation: number
	oxygen: number
	oceans: number
	temperature: number

	/**  Player index (NOT ID) currently playing round (only for GenerationInProgress) */
	currentPlayer: number
	players: PlayerState[]

	map: MapState
}

export interface MapState {
	width: number
	height: number

	grid: GridCell[][]
}

export enum GridCellType {
	Ocean,
	General,
	NoctisCity,
	GanymedeColony,
	PhobosSpaceHaven,
}

export enum GridCellSpecial {
	NoctisCity,
	TharsisTholus,
	AscraeusMons,
	PavonisMons,
	ArsiaMons,
	GanymedeColony,
	PhobosSpaceHaven,
}

export enum GridCellContent {
	City,
	Forest,
	Ocean,
	Other,
}

export enum GridCellOther {
	Capital,
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

	content?: GridCellContent
	other?: GridCellOther

	ownerId?: number
	ownerCard?: number
}

export interface PlayerState {
	id: number
	name: string
	session: string
	connected: boolean
	bot: boolean

	gameState: PlayerGameState
}

export interface PlayerGameState {
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

	/** Is placing a tile */
	placingTile: {
		type: GridCellContent
		other?: GridCellOther
		ownerCard?: number
		special?: GridCellSpecial
	}
}

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
}
