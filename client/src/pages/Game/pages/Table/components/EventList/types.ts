import { Resource, CardResource, GameProgress } from '@shared/cards'
import { GridCellContent } from '@shared/index'

export enum EventType {
	CardPlayed,
	CardUsed,
	CardsReceived,
	ResourceChanged,
	ProductionChanged,
	CardResourceChanged,
	GameProgressChanged,
	TilePlaced,
	CorporationPicked
}

type CardPlayed = {
	type: typeof EventType.CardPlayed
	playerId: number
	card: string
}

type CardUsed = {
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
	playerId: number
}

type CorporationPicked = {
	type: typeof EventType.CorporationPicked
	playerId: number
	corporation: string
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
