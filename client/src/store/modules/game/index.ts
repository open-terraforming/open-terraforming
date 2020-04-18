import { GameState, PlayerState, PlayerStateValue } from '@shared/index'
import { keyMap } from '@shared/utils'
import { initialGameState, initialPlayerState } from '@shared/states'
import { GameEvent } from '@/pages/Game/pages/Table/components/EventList/types'
import { getEvents } from './utils'

type State = Readonly<typeof initialState>

const initialState = {
	playerId: undefined as number | undefined,
	state: initialGameState(),
	player: initialPlayerState(),
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

			return {
				...state,
				state: action.state,
				player: player ?? state.player,
				playerMap: keyMap(action.state.players, 'id'),
				playing:
					player?.state === PlayerStateValue.Playing &&
					player?.placingTile.length === 0 &&
					player?.cardsToPlay.length === 0,
				interrupted: player
					? player?.placingTile.length > 0 ||
					  player?.cardsToPlay.length > 0 ||
					  player.state === PlayerStateValue.PickingCards ||
					  player.state === PlayerStateValue.PickingCorporation ||
					  player.state === PlayerStateValue.PickingPreludes
					: false,
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
