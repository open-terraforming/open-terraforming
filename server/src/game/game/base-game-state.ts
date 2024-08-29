import { State } from '@/lib/state-machine'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { Game } from '../game'

export class BaseGameState extends State<GameStateValue> {
	game: Game

	get currentPlayer() {
		return this.game.currentPlayer
	}

	get logger() {
		return this.game.logger
	}

	get state() {
		return this.game.state
	}

	constructor(game: Game) {
		super()

		this.game = game
	}

	selectCurrentPlayer(index: number, state = PlayerStateValue.Playing) {
		this.state.currentPlayer = index
		this.game.currentPlayer.actionsPlayed = 0
		this.game.currentPlayer.state = state
	}

	findNextPlayer() {
		// Cycles all players (starting from player next to current)
		for (let i = 1; i < this.state.players.length + 1; i++) {
			const index = (this.state.currentPlayer + i) % this.state.players.length
			const player = this.state.players[index]

			if (player.state === PlayerStateValue.WaitingForTurn) {
				return index
			}
		}
	}

	createLock() {
		return this.game.lockSystem.createLock(this.state)
	}

	clearLock() {
		this.game.lockSystem.clearLock(this.state.id)
	}

	getLock() {
		return this.game.lockSystem.tryLoadLock(this.state.id)
	}
}
