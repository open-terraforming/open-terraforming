type State = Readonly<typeof initialState>

const initialState = {
	buyingCardIndex: undefined as number | undefined
}

export default (state = initialState, action: Action): State => {
	switch (action.type) {
		case TABLE_SET_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const TABLE_SET_STATE = 'TABLE_SET_STATE'

type TableSetState = {
	type: typeof TABLE_SET_STATE
	state: Partial<State>
}

type Action = TableSetState

export const setTableState = (state: Partial<State>) =>
	({
		type: TABLE_SET_STATE,
		state
	} as TableSetState)
