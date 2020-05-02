import { State } from '@/lib/state-machine'
import { GameStateValue, PlayerStateValue } from '@shared/index'
import { Game } from '../game'

export class BaseGameState extends State<GameStateValue> {
	game: Game

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
		this.game.currentPlayer.state = state
	}

	findNextPlayer() {
		for (let i = 1; i < this.state.players.length; i++) {
			const index = (this.state.currentPlayer + i) % this.state.players.length
			const player = this.state.players[index]

			if (player.state === PlayerStateValue.WaitingForTurn) {
				return index
			}
		}
	}
}
