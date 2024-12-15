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

		default:
			return state
	}
}

const TABLE_SET_STATE = 'TABLE_SET_STATE'
const TABLE_PUSH_FRONTEND_ACTION = 'TABLE_PUSH_FRONTEND_ACTION'
const TABLE_POP_FRONTEND_ACTION = 'TABLE_POP_FRONTEND_ACTION'

type Action =
	| ReturnType<typeof setTableState>
	| ReturnType<typeof pushFrontendAction>
	| ReturnType<typeof popFrontendAction>

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
