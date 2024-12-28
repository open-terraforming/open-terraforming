import { GameInfo } from '@shared/extra'
import { GameConfig } from '@shared/game/game'
import { GameStateValue } from '@shared/index'

type State = Readonly<typeof initialState>

const initialState = {
	name: '',
	id: undefined as number | undefined,
	gameState: undefined as GameStateValue | undefined,
	info: undefined as GameInfo | undefined,
	localGameConfig: undefined as GameConfig | undefined,
}

export default (state = initialState, action: Actions): State => {
	switch (action.type) {
		case SET_CLIENT_STATE: {
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
