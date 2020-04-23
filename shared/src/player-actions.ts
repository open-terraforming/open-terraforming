import { PlacementState } from './placements'

export enum PlayerActionType {
	PickCorporation = 1,
	PickCards,
	PickPreludes,
	PlaceTile,
	PlayCard,
	ClaimTile,
	SponsorCompetition
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

export const sponsorCompetitionAction = () =>
	({
		type: PlayerActionType.SponsorCompetition
	} as const)

export const claimTileAction = () =>
	({
		type: PlayerActionType.ClaimTile
	} as const)

export type PlayerAction =
	| ReturnType<typeof placeTileAction>
	| ReturnType<typeof pickCorporationAction>
	| ReturnType<typeof pickCardsAction>
	| ReturnType<typeof pickPreludesAction>
	| ReturnType<typeof playCardAction>
	| ReturnType<typeof sponsorCompetitionAction>
	| ReturnType<typeof claimTileAction>
