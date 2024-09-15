import { CardResource, GameProgress, Resource } from '@shared/cards'
import { CompetitionType } from '@shared/competitions'
import { GridCellContent, GridCellOther } from '@shared/index'
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
}

export type CardPlayed = {
	type: typeof EventType.CardPlayed
	playerId: number
	card: string
}

export type CardUsed = {
	type: typeof EventType.CardUsed
	playerId: number
	card: string
	index: number
}

type CardsReceived = {
	type: typeof EventType.CardsReceived
	playerId: number
	amount: number
}

type ResourcesChanged = {
	type: typeof EventType.ResourcesChanged
	resources: Record<Resource, number>
	playerId: number
}

type ProductionChanged = {
	type: typeof EventType.ProductionChanged
	playerId: number
	resource: Resource
	amount: number
}

type CardResourceChanged = {
	type: typeof EventType.CardResourceChanged
	playerId: number
	card: string
	index: number
	resource: CardResource
	amount: number
}

type GameProgressChanged = {
	type: typeof EventType.GameProgressChanged
	progress: GameProgress
	amount: number
}

type TilePlaced = {
	type: typeof EventType.TilePlaced
	tile: GridCellContent
	other?: GridCellOther
	playerId: number
}

type CorporationPicked = {
	type: typeof EventType.CorporationPicked
	playerId: number
	corporation: string
}

type RatingChanged = {
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

type PlayingChanged = {
	type: typeof EventType.PlayingChanged
	playing: number
}

type NewGeneration = {
	type: typeof EventType.NewGeneration
}

type ProductionPhase = {
	type: typeof EventType.ProductionPhase
}

type ColonyBuilt = {
	type: typeof EventType.ColonyBuilt
	playerId: number
	colony: number
}

type ColonyActivated = {
	type: typeof EventType.ColonyActivated
	colony: number
}

type ColonyTrading = {
	type: typeof EventType.ColonyTrading
	colony: number
	playerId: number
}

type ColonyTradingStepChanged = {
	type: typeof EventType.ColonyTradingStepChanged
	colony: number
	change: number
}

type PlayerTradeFleetsChange = {
	type: typeof EventType.PlayerTradeFleetsChange
	playerId: number
	amount: number
}

export type GameEvent =
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
	| ColonyBuilt
	| ColonyActivated
	| ColonyTrading
	| ColonyTradingStepChanged
	| PlayerTradeFleetsChange

export type PopEvent = (PlayingChanged | NewGeneration | ProductionPhase) & {
	id: number
}
