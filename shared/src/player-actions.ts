import { PlacementState } from './placements'

export enum PlayerActionType {
	// PickCorporation = 1,
	PickCards,
	PickPreludes,
	DraftCard,
	PlaceTile,
	PlayCard,
	ClaimTile,
	SponsorCompetition,
	PickStarting
}

export const placeTileAction = (state: PlacementState) =>
	({
		type: PlayerActionType.PlaceTile,
		state
	} as const)

/*
export const pickCorporationAction = (cards: string[]) =>
	({
		type: PlayerActionType.PickCorporation,
		cards
	} as const)
*/

export const draftCardAction = (cards: string[], limit = 1) =>
	({
		type: PlayerActionType.DraftCard,
		cards,
		limit
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

export const sponsorCompetitionAction = () =>
	({
		type: PlayerActionType.SponsorCompetition
	} as const)

export const claimTileAction = () =>
	({
		type: PlayerActionType.ClaimTile
	} as const)

export const pickStartingAction = (
	corporations: string[],
	cards: string[],
	preludes: string[],
	preludesLimit: number
) =>
	({
		type: PlayerActionType.PickStarting,
		corporations,
		cards,
		preludes,
		preludesLimit
	} as const)

export type PlayerAction =
	| ReturnType<typeof placeTileAction>
	| ReturnType<typeof pickCardsAction>
	| ReturnType<typeof pickPreludesAction>
	| ReturnType<typeof playCardAction>
	| ReturnType<typeof sponsorCompetitionAction>
	| ReturnType<typeof claimTileAction>
	| ReturnType<typeof draftCardAction>
	| ReturnType<typeof pickStartingAction>
