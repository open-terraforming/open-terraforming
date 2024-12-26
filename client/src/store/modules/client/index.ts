import { GameStateValue } from '@shared/index'
import { GameInfo } from '@shared/extra'
import { GameConfig } from '@shared/game/game'

type State = Readonly<typeof initialState>

export type SavedSessionInfo = {
	name: string
	generation: number
	finished: boolean
	session: string
	lastUpdateAt: number
}

const SESSIONS_STORAGE_KEY = 'ot-saved-sessions'

let sessions = {} as Record<string, SavedSessionInfo>

try {
	if (localStorage['sessions']) {
		sessions = JSON.parse(localStorage[SESSIONS_STORAGE_KEY])
	}
} catch {
	sessions = {}
}

const initialState = {
	name: '',
	sessions,
	id: undefined as number | undefined,
	gameState: undefined as GameStateValue | undefined,
	info: undefined as GameInfo | undefined,
	localGameConfig: undefined as GameConfig | undefined,
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SET_CLIENT_STATE: {
			if (action.state.sessions) {
				localStorage[SESSIONS_STORAGE_KEY] = JSON.stringify(
					action.state.sessions,
				)
			}

			return {
				...state,
				...action.state,
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
		state,
	}) as const

type Actions = ReturnType<typeof setClientState>
