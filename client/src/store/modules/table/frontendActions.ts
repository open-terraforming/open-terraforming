import { StandardProjectType } from '@shared/gameState'
import { PlacementState } from '@shared/placements'

export enum FrontendPendingActionType {
	PickHandCards = 1,
	PickTile,
}

export const pickHandCardsFrontendAction = (project: StandardProjectType) =>
	({
		type: FrontendPendingActionType.PickHandCards,
		project,
	}) as const

export const pickTileFrontendAction = (
	state: PlacementState,
	project: StandardProjectType,
) =>
	({
		type: FrontendPendingActionType.PickTile,
		state,
		project,
	}) as const

export type PickHandCardsFrontendAction = ReturnType<
	typeof pickHandCardsFrontendAction
>

export type PickTileFrontendAction = ReturnType<typeof pickTileFrontendAction>

export type FrontendPendingAction =
	| PickHandCardsFrontendAction
	| PickTileFrontendAction
