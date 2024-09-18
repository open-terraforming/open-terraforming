import { CardResource, GameProgress, Resource } from '@shared/cards'
import { CompetitionType } from '@shared/competitions'
import {
	GridCellContent,
	GridCellOther,
	StandardProjectType,
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
}

export type CardPlayed = {
	type: typeof EventType.CardPlayed
	playerId: number
	card: string
	changes?: GameEvent[]
}

export type CardUsed = {
	type: typeof EventType.CardUsed
	playerId: number
	card: string
	index: number
	changes?: GameEvent[]
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
}

export type ColonyActivated = {
	type: typeof EventType.ColonyActivated
	colony: number
}

export type ColonyTrading = {
	type: typeof EventType.ColonyTrading
	colony: number
	playerId: number
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
	| StandardProjectBought

export type PopEvent = (PlayingChanged | NewGeneration | ProductionPhase) & {
	id: number
}
