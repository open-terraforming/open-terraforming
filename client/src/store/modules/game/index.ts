import {
	GameState,
	GridCellLocation,
	PlayerState,
	PlayerStateValue,
} from '@shared/index'
import { keyMap, pendingActions } from '@shared/utils'
import { initialGameState, initialPlayerState } from '@shared/states'
import { GameEvent } from '@shared/index'
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
	spectating: false,
	events: [] as GameEvent[],
	highlightedCells: [] as {
		x: number
		y: number
		location: GridCellLocation | undefined
	}[],
	resultsShown: false,
}

export default (state = initialState, action: Action): State => {
	switch (action.type) {
		case SET_GAME_STATE: {
			const player = state.spectating
				? undefined
				: action.state.players.find((p) => p.id === state.playerId)

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
				events: action.state.events,
			}
		}

		case SET_GAME_PLAYER: {
			let player =
				state.state?.players.find((p) => p.id === action.playerId) ??
				state.player

			if (action.spectating) {
				player = { ...player, id: -1 }
			}

			return {
				...state,
				spectating: action.spectating,
				playerId: action.playerId,
				player,
			}
		}

		case SET_GAME_INFO: {
			return {
				...state,
				info: action.info,
			}
		}

		case SET_GAME_HIGHLIGHTED_CELLS: {
			return {
				...state,
				highlightedCells: action.highlightedCells,
			}
		}

		case SET_GAME_RESULTS_SHOWN: {
			return {
				...state,
				resultsShown: action.shown,
			}
		}

		default:
			return state
	}
}

const SET_GAME_STATE = 'SET_GAME_STATE'
const SET_GAME_PLAYER = 'SET_GAME_PLAYER'
const SET_GAME_INFO = 'SET_GAME_INFO'
const SET_GAME_HIGHLIGHTED_CELLS = 'SET_GAME_HIGHLIGHTED_CELLS'
const SET_GAME_RESULTS_SHOWN = 'SET_GAME_RESULTS_SHOWN'

export const setGameState = (state: GameState) =>
	({
		type: SET_GAME_STATE,
		state,
	}) as const

export const setGamePlayer = (playerId: number, spectating: boolean) =>
	({
		type: SET_GAME_PLAYER,
		playerId,
		spectating,
	}) as const

export const setGameInfo = (info: GameInfo) =>
	({
		type: SET_GAME_INFO,
		info,
	}) as const

export const setGameHighlightedCells = (
	cells: { x: number; y: number; location: GridCellLocation | undefined }[],
) =>
	({
		type: SET_GAME_HIGHLIGHTED_CELLS,
		highlightedCells: cells,
	}) as const

export const setGameResultsShown = (shown: boolean) =>
	({
		type: SET_GAME_RESULTS_SHOWN,
		shown,
	}) as const

type Action =
	| ReturnType<typeof setGameState>
	| ReturnType<typeof setGamePlayer>
	| ReturnType<typeof setGameInfo>
	| ReturnType<typeof setGameHighlightedCells>
	| ReturnType<typeof setGameResultsShown>
