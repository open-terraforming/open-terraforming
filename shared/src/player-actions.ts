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

export const placeTileAction = (ctx: PlacementState) => ({
	type: PlayerActionType.PlaceTile,
	data: ctx
})

export const pickCorporationAction = (cards: string[]) => ({
	type: PlayerActionType.PickCorporation,
	data: {
		cards
	}
})

export const pickCardsAction = (cards: string[], limit = 0, free = false) => ({
	type: PlayerActionType.PickCards,
	data: {
		cards,
		limit,
		free
	}
})

export const pickPreludesAction = (cards: string[]) => ({
	type: PlayerActionType.PickPreludes,
	data: {
		cards
	}
})

export const playCardAction = (cardIndex: number) => ({
	type: PlayerActionType.PlayCard,
	data: {
		cardIndex
	}
})

export const sponsorCompetition = (type: CompetitionType) => ({
	type: PlayerActionType.SponsorCompetition,
	data: {
		type
	}
})

export const selectPlayer = (
	source: number,
	choices: number[],
	description: string
) => ({
	type: PlayerActionType.SponsorCompetition,
	data: {
		source,
		choices,
		description
	}
})

export type PlayerAction =
	| ReturnType<typeof placeTileAction>
	| ReturnType<typeof pickCorporationAction>
	| ReturnType<typeof pickCardsAction>
	| ReturnType<typeof pickPreludesAction>
	| ReturnType<typeof playCardAction>
	| ReturnType<typeof sponsorCompetition>
	| ReturnType<typeof selectPlayer>
