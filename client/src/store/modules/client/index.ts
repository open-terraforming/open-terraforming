import { GameStateValue } from '@shared/game'
import { NativeMap } from '@/utils/collections'
import { GameInfo } from '@shared/extra'

type State = Readonly<typeof initialState>

let sessions = {} as NativeMap<string>

try {
	if (localStorage['sessions']) {
		sessions = JSON.parse(localStorage['sessions'])
	}
} catch (e) {
	sessions = {}
}

const initialState = {
	name: '',
	sessions,
	id: undefined as number | undefined,
	gameState: undefined as GameStateValue | undefined,
	info: undefined as GameInfo | undefined
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SET_CLIENT_STATE: {
			if (action.state.sessions) {
				localStorage['sessions'] = JSON.stringify(action.state.sessions)
			}

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

export const setClientState = (state: Partial<State>) =>
	({
		type: SET_CLIENT_STATE,
		state
	} as const)

type Actions = ReturnType<typeof setClientState>
