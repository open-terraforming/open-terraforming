import { GameState, PlayerState } from '@shared/index'

type State = Readonly<typeof initialState>

const initialState = {
	playerId: undefined as number | undefined,
	state: undefined as GameState | undefined,
	player: undefined as PlayerState | undefined
}

export default (state = initialState, action: Action): State => {
	switch (action.type) {
		case SET_GAME_STATE: {
			const player = action.state.players.find(p => p.id === state.playerId)

			return {
				...state,
				state: action.state,
				player
			}
		}

		case SET_GAME_PLAYER: {
			const player = state.state?.players.find(p => p.id === action.playerId)

			return {
				...state,
				playerId: action.playerId,
				player
			}
		}

		default:
			return state
	}
}

const SET_GAME_STATE = 'SET_GAME_STATE'
const SET_GAME_PLAYER = 'SET_GAME_PLAYER'

interface SetGameState {
	type: typeof SET_GAME_STATE
	state: GameState
}

export const setGameState = (state: GameState) =>
	({
		type: SET_GAME_STATE,
		state
	} as SetGameState)

interface SetGamePlayer {
	type: typeof SET_GAME_PLAYER
	playerId: number
}

export const setGamePlayer = (playerId: number) =>
	({
		type: SET_GAME_PLAYER,
		playerId
	} as SetGamePlayer)

type Action = SetGameState | SetGamePlayer
