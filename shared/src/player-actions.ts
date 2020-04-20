import { PlacementState } from './placements'
import { CompetitionType } from './competitions'

export enum PlayerActionType {
	PickCorporation = 1,
	PickCards,
	PickPreludes,
	PlaceTile,
	PlayCard,
	SponsorCompetition,
	SelectPlayer
}

export const placeTileAction = (state: PlacementState) =>
	({
		type: PlayerActionType.PlaceTile,
		state
	} as const)

export const pickCorporationAction = (cards: string[]) =>
	({
		type: PlayerActionType.PickCorporation,
		cards
	} as const)

export const pickCardsAction = (cards: string[], limit = 0, free = false) =>
	({
		type: PlayerActionType.PickCards,

		cards,
		limit,
		free
	} as const)

export const pickPreludesAction = (cards: string[], limit = 0) =>
	({
		type: PlayerActionType.PickPreludes,

		cards,
		limit
	} as const)

export const playCardAction = (cardIndex: number) =>
	({
		type: PlayerActionType.PlayCard,

		cardIndex
	} as const)

export const sponsorCompetition = (competition: CompetitionType) =>
	({
		type: PlayerActionType.SponsorCompetition,

		competition
	} as const)

export const selectPlayer = (
	source: number,
	choices: number[],
	description: string
) =>
	({
		type: PlayerActionType.SponsorCompetition,
		source,
		choices,
		description
	} as const)

export type PlayerAction =
	| ReturnType<typeof placeTileAction>
	| ReturnType<typeof pickCorporationAction>
	| ReturnType<typeof pickCardsAction>
	| ReturnType<typeof pickPreludesAction>
	| ReturnType<typeof playCardAction>
	| ReturnType<typeof sponsorCompetition>
	| ReturnType<typeof selectPlayer>

export interface PlayerActionItem {
	/** Action info */
	action: PlayerAction
	/** Should the action be only played when player is playing */
	playing: boolean
}
