import { Resource, CardResource, GameProgress } from '@shared/cards'
import { GridCellContent, GridCellOther } from '@shared/index'
import { CompetitionType } from '@shared/competitions'
import { MilestoneType } from '@shared/milestones'

export enum EventType {
	CardPlayed = 1,
	CardUsed,
	CardsReceived,
	ResourceChanged,
	ProductionChanged,
	CardResourceChanged,
	GameProgressChanged,
	TilePlaced,
	CorporationPicked,
	RatingChanged,
	CompetitionSponsored,
	MilestoneBought,
	PlayingChanged,
	NewGeneration
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

type ResourceChanged = {
	type: typeof EventType.ResourceChanged
	resource: Resource
	amount: number
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

type CompetitionSponsored = {
	type: typeof EventType.CompetitionSponsored
	competition: CompetitionType
	playerId: number
}

type MilestoneBought = {
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

export type GameEvent =
	| CardPlayed
	| CardsReceived
	| CardUsed
	| ResourceChanged
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

export type PopEvent = (PlayingChanged | NewGeneration) & { id: number }
