import { CardResource, GameProgress, Resource } from '@shared/cards'
import { CompetitionType } from '@shared/competitions'
import {
	ColonyState,
	GridCellContent,
	GridCellOther,
	PlayerId,
	StandardProjectType,
	UsedCardState,
} from '@shared/index'
import { MilestoneType } from '@shared/milestones'

export enum EventType {
	CardPlayed = 1,
	CardUsed,
	CardsReceived,
	ResourcesChanged,
	ProductionChanged,
	CardResourceChanged,
	GameProgressChanged,
	TilePlaced,
	CorporationPicked,
	RatingChanged,
	CompetitionSponsored,
	MilestoneBought,
	PlayingChanged,
	NewGeneration,
	ProductionPhase,
	ColonyBuilt,
	ColonyActivated,
	ColonyTrading,
	ColonyTradingStepChanged,
	PlayerTradeFleetsChange,
	StandardProjectBought,
	TileAcquired,
	StartingSetup,
	ProductionDone,
	TileClaimed,
	WorldGovernmentTerraforming,
	MarsTerraformed,
	CommitteePartyDelegateChange,
	CommitteePartyLeaderChanged,
	CommitteeDominantPartyChanged,
	CurrentGlobalEventExecuted,
	GlobalEventsChanged,
	NewGovernment,
	PlayerMovedDelegate,
	CommitteePartyActivePolicyActivated,
}

export type StartingSetup = {
	type: typeof EventType.StartingSetup
	playerId: number
	corporation: string
	preludes: string[]
	changes: GameEvent[]
}

export type CardPlayed = {
	type: typeof EventType.CardPlayed
	playerId: number
	card: string
	changes: GameEvent[]
}

export type CardUsed = {
	type: typeof EventType.CardUsed
	playerId: number
	card: string
	index: number
	changes: GameEvent[]
	state: UsedCardState
}

export type CardsReceived = {
	type: typeof EventType.CardsReceived
	playerId: number
	amount: number
}

export type ResourcesChanged = {
	type: typeof EventType.ResourcesChanged
	resources: Record<Resource, number>
	playerId: number
}

export type ProductionChanged = {
	type: typeof EventType.ProductionChanged
	playerId: number
	resource: Resource
	amount: number
}

export type CardResourceChanged = {
	type: typeof EventType.CardResourceChanged
	playerId: number
	card: string
	index: number
	resource: CardResource
	amount: number
}

export type GameProgressChanged = {
	type: typeof EventType.GameProgressChanged
	progress: GameProgress
	amount: number
}

export type TilePlaced = {
	type: typeof EventType.TilePlaced
	tile: GridCellContent
	other?: GridCellOther
	cell: { x: number; y: number }
	playerId: number
}

export type CorporationPicked = {
	type: typeof EventType.CorporationPicked
	playerId: number
	corporation: string
}

export type RatingChanged = {
	type: typeof EventType.RatingChanged
	playerId: number
	amount: number
}

export type CompetitionSponsored = {
	type: typeof EventType.CompetitionSponsored
	competition: CompetitionType
	playerId: number
}

export type MilestoneBought = {
	type: typeof EventType.MilestoneBought
	milestone: MilestoneType
	playerId: number
}

export type PlayingChanged = {
	type: typeof EventType.PlayingChanged
	playing: number
}

export type NewGeneration = {
	type: typeof EventType.NewGeneration
	generation: number
}

export type ProductionPhase = {
	type: typeof EventType.ProductionPhase
}

export type ColonyBuilt = {
	type: typeof EventType.ColonyBuilt
	playerId: number
	colony: number
	state: ColonyState
	changes: GameEvent[]
}

export type ColonyActivated = {
	type: typeof EventType.ColonyActivated
	colony: number
}

export type ColonyTrading = {
	type: typeof EventType.ColonyTrading
	colony: number
	playerId: number
	at: number
	state: ColonyState
	changes: GameEvent[]
}

export type ColonyTradingStepChanged = {
	type: typeof EventType.ColonyTradingStepChanged
	colony: number
	change: number
}

export type PlayerTradeFleetsChange = {
	type: typeof EventType.PlayerTradeFleetsChange
	playerId: number
	amount: number
}

export type StandardProjectBought = {
	type: typeof EventType.StandardProjectBought
	playerId: number
	project: StandardProjectType
	changes: GameEvent[]
}

export type TileAcquired = {
	type: typeof EventType.TileAcquired
	tile: GridCellContent
	other?: GridCellOther
	playerId: number
}

export type ProductionDone = {
	type: EventType.ProductionDone
	players: ResourcesChanged[]
}

export type TileClaimed = {
	type: EventType.TileClaimed
	tile: { x: number; y: number }
	playerId: number
}

export type WorldGovernmentTerraforming = {
	type: EventType.WorldGovernmentTerraforming
	progress: GameProgress
	playerId: number
}

export type MarsTerraformed = {
	type: EventType.MarsTerraformed
}

export type CommitteePartyDelegateChange = {
	type: EventType.CommitteePartyDelegateChange
	partyCode: string
	playerId: number | null
	change: number
}

export type CommitteePartyLeaderChanged = {
	type: EventType.CommitteePartyLeaderChanged
	partyCode: string
	playerId: number | null
}

export type CommitteeDominantPartyChanged = {
	type: EventType.CommitteeDominantPartyChanged
	partyCode: string
}

export type GlobalEventExecuted = {
	type: EventType.CurrentGlobalEventExecuted
	eventCode: string
	/** Key is player id */
	influencePerPlayer: Record<number, number>
	changes: GameEvent[]
}

export type GlobalEventsChanged = {
	type: EventType.GlobalEventsChanged
	previous: {
		distant: string | null
		coming: string | null
		current: string | null
	}
	current: {
		distant: string | null
		coming: string | null
		current: string | null
	}
	changes: GameEvent[]
}

export type NewGovernment = {
	type: EventType.NewGovernment
	oldRulingParty: string
	newRulingParty: string
	oldChairman: PlayerId | null
	newChairman: PlayerId | null
	changes: GameEvent[]
}

export type BaseGameEvent = {
	processed?: boolean
}

export type PlayerMovedDelegate = {
	type: EventType.PlayerMovedDelegate
	playerId: number
	change: number
	partyCode: string
	changes: GameEvent[]
}

export type CommitteePartyActivePolicyActivated = {
	type: EventType.CommitteePartyActivePolicyActivated
	playerId: number
	partyCode: string
	changes: GameEvent[]
}

export type GameEvent = BaseGameEvent &
	(
		| CardPlayed
		| CardsReceived
		| CardUsed
		| ResourcesChanged
		| ProductionChanged
		| CardResourceChanged
		| GameProgressChanged
		| TilePlaced
		| CorporationPicked
		| RatingChanged
		| MilestoneBought
		| CompetitionSponsored
		| PlayingChanged
		| NewGeneration
		| ProductionPhase
		| ProductionDone
		| ColonyBuilt
		| ColonyActivated
		| ColonyTrading
		| ColonyTradingStepChanged
		| PlayerTradeFleetsChange
		| StandardProjectBought
		| TileAcquired
		| StartingSetup
		| TileClaimed
		| WorldGovernmentTerraforming
		| MarsTerraformed
		| CommitteePartyDelegateChange
		| CommitteePartyLeaderChanged
		| CommitteeDominantPartyChanged
		| GlobalEventExecuted
		| GlobalEventsChanged
		| NewGovernment
		| PlayerMovedDelegate
		| CommitteePartyActivePolicyActivated
	)

export type PopEvent = (PlayingChanged | NewGeneration | ProductionPhase) & {
	id: number
}
