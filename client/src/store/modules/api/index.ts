type State = Readonly<typeof initialState>

const initialState = {
	error: null as string | null,
	connected: false,
	reconnecting: false,
	failed: false
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case API_SET_STATE: {
			return {
				...state,
				...action.state
			}
		}

		default:
			return state
	}
}

const API_SET_STATE = 'API_SET_STATE'

type ApiSetState = {
	type: typeof API_SET_STATE
	state: Partial<State>
}

type Actions = ApiSetState

export const setApiError = (error: string | null) =>
	({
		type: API_SET_STATE,
		state: { error }
	} as ApiSetState)

export const setApiConnected = (connected: boolean) =>
	({
		type: API_SET_STATE,
		state: { connected }
	} as ApiSetState)

export const setApiReconnecting = (reconnecting: boolean) =>
	({
		type: API_SET_STATE,
		state: { reconnecting }
	} as ApiSetState)

export const setApiFailed = (failed: boolean) =>
	({
		type: API_SET_STATE,
		state: { failed }
	} as ApiSetState)

export const setApiState = (state: Partial<State>) =>
	({
		type: API_SET_STATE,
		state
	} as ApiSetState)
