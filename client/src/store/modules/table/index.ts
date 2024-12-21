import { GridCellLocation } from '@shared/gameState'
import { PlacementState } from '@shared/placements'
import { FrontendPendingAction } from './frontendActions'

type State = Readonly<typeof initialState>

const initialState = {
	buyingCardIndex: undefined as number | undefined,
	playingCardIndex: undefined as number | undefined,
	pickingCellForBuyArg: undefined as
		| undefined
		| {
				state: PlacementState
				onPick: (
					x: number,
					y: number,
					location: GridCellLocation | null,
				) => void
		  },
	pendingFrontendActions: [] as FrontendPendingAction[],
	currentlySelectedTiles: [] as {
		x: number
		y: number
		location?: GridCellLocation
	}[],
}

export default (state = initialState, action: Action): State => {
	switch (action.type) {
		case TABLE_SET_STATE: {
			return {
				...state,
				...action.state,
			}
		}

		case TABLE_PUSH_FRONTEND_ACTION: {
			return {
				...state,
				pendingFrontendActions: [
					...state.pendingFrontendActions,
					action.action,
				],
			}
		}

		case TABLE_POP_FRONTEND_ACTION: {
			return {
				...state,
				pendingFrontendActions: state.pendingFrontendActions.slice(1),
			}
		}

		case TABLE_PUSH_SELECTED_TILE: {
			return {
				...state,
				currentlySelectedTiles: [
					...state.currentlySelectedTiles,
					{ x: action.x, y: action.y, location: action.location },
				],
			}
		}

		case TABLE_REMOVE_SELECTED_TILE: {
			return {
				...state,
				currentlySelectedTiles: state.currentlySelectedTiles.filter(
					(t) =>
						t.x !== action.x ||
						t.y !== action.y ||
						t.location !== action.location,
				),
			}
		}

		default:
			return state
	}
}

const TABLE_SET_STATE = 'TABLE_SET_STATE'
const TABLE_PUSH_FRONTEND_ACTION = 'TABLE_PUSH_FRONTEND_ACTION'
const TABLE_POP_FRONTEND_ACTION = 'TABLE_POP_FRONTEND_ACTION'
const TABLE_PUSH_SELECTED_TILE = 'TABLE_PUSH_SELECTED_TILE'
const TABLE_REMOVE_SELECTED_TILE = 'TABLE_REMOVE_SELECTED_TILE'

type Action =
	| ReturnType<typeof setTableState>
	| ReturnType<typeof pushFrontendAction>
	| ReturnType<typeof popFrontendAction>
	| ReturnType<typeof pushSelectedTile>
	| ReturnType<typeof removeSelectedTile>

export const setTableState = (state: Partial<State>) =>
	({
		type: TABLE_SET_STATE,
		state,
	}) as const

export const pushFrontendAction = (action: FrontendPendingAction) =>
	({
		type: TABLE_PUSH_FRONTEND_ACTION,
		action,
	}) as const

export const popFrontendAction = () =>
	({
		type: TABLE_POP_FRONTEND_ACTION,
	}) as const

export const pushSelectedTile = (
	x: number,
	y: number,
	location?: GridCellLocation,
) =>
	({
		type: TABLE_PUSH_SELECTED_TILE,
		x,
		y,
		location,
	}) as const

export const removeSelectedTile = (
	x: number,
	y: number,
	location?: GridCellLocation,
) =>
	({
		type: TABLE_REMOVE_SELECTED_TILE,
		x,
		y,
		location,
	}) as const
