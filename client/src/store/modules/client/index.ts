type State = Readonly<typeof initialState>

const initialState = {
	initialized: false,
	name: '',
	session: undefined as string | undefined,
	id: undefined as number | undefined
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SET_CLIENT_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const SET_CLIENT_STATE = 'SET_CLIENT_STATE'

interface SetClientState {
	type: typeof SET_CLIENT_STATE
	state: State
}

export const setClientState = (state: Partial<State>) =>
	({
		type: SET_CLIENT_STATE,
		state
	} as SetClientState)

type Actions = SetClientState
