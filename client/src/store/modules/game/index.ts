import { GameState, PlayerState, PlayerStateValue } from '@shared/index'
import { keyMap, pendingActions } from '@shared/utils'
import { initialGameState, initialPlayerState } from '@shared/states'
import { GameEvent } from '@/pages/Game/pages/Table/components/EventList/types'
import { getEvents } from './utils'
import { GameInfo } from '@shared/extra'
import { PlayerAction } from '@shared/player-actions'
import { objDiff } from '@/utils/collections'

type State = Readonly<typeof initialState>

const initialState = {
	playerId: undefined as number | undefined,
	info: undefined as GameInfo | undefined,
	state: initialGameState(),
	player: initialPlayerState(),
	pendingAction: undefined as PlayerAction | undefined,
	playerMap: {} as Record<number, PlayerState>,
	playing: false,
	interrupted: false,
	events: [] as GameEvent[]
}

export default (state = initialState, action: Action): State => {
	switch (action.type) {
		case SET_GAME_STATE: {
			const player = action.state.players.find(p => p.id === state.playerId)
			const events = getEvents(state.state, action.state)
			const pendingAction = player && pendingActions(player)[0]

			console.groupCollapsed('Game changed')
			console.log('GAME', action.state)
			console.log('DIFF', objDiff(state.state, action.state))
			console.groupEnd()

			return {
				...state,
				state: action.state,
				player: player ?? state.player,
				playerMap: keyMap(action.state.players, 'id'),
				pendingAction,
				playing: player?.state === PlayerStateValue.Playing && !pendingAction,
				interrupted: !!pendingAction,
				events: events.length > 0 ? [...state.events, ...events] : state.events
			}
		}

		case SET_GAME_PLAYER: {
			const player = state.state?.players.find(p => p.id === action.playerId)

			return {
				...state,
				playerId: action.playerId,
				player: player ?? state.player
			}
		}

		case SET_GAME_INFO: {
			return {
				...state,
				info: action.info
			}
		}

		default:
			return state
	}
}

const SET_GAME_STATE = 'SET_GAME_STATE'
const SET_GAME_PLAYER = 'SET_GAME_PLAYER'
const SET_GAME_INFO = 'SET_GAME_INFO'

export const setGameState = (state: GameState) =>
	({
		type: SET_GAME_STATE,
		state
	} as const)

export const setGamePlayer = (playerId: number) =>
	({
		type: SET_GAME_PLAYER,
		playerId
	} as const)

export const setGameInfo = (info: GameInfo) =>
	({
		type: SET_GAME_INFO,
		info
	} as const)

type Action =
	| ReturnType<typeof setGameState>
	| ReturnType<typeof setGamePlayer>
	| ReturnType<typeof setGameInfo>
