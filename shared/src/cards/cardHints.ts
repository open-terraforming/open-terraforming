import { GridCellContent } from '..'
import { CardCategory, GameProgress } from './types'

export enum CardHintType {
	TagsCount = 1,
	Progress,
	TileCount,
	ColonyCount,
}

export const tagsCountHint = (tags: CardCategory[], allPlayers = false) =>
	({
		type: CardHintType.TagsCount,
		tags,
		allPlayers,
	}) as const

export const progressHint = (progress: GameProgress) =>
	({
		type: CardHintType.Progress,
		progress,
	}) as const

export const tileCountHint = (type: GridCellContent) =>
	({
		type: CardHintType.TileCount,
		tileType: type,
	}) as const

export const colonyCountHint = () =>
	({
		type: CardHintType.ColonyCount,
	}) as const

export type CardHint =
	| ReturnType<typeof tagsCountHint>
	| ReturnType<typeof progressHint>
	| ReturnType<typeof tileCountHint>
	| ReturnType<typeof colonyCountHint>
