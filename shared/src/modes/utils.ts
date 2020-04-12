import { GameMode } from './types'
import { GameState, PlayerStateValue } from '../game'
import { Card } from '../cards'
import { shuffle, range } from '../utils'
import { Corporations } from '../corporations'

export const gameMode = (m: GameMode) => m

export const prepareCorporations = (game: GameState, amount = 2) => {
	let corporations = [] as Card[]
	const nextCorp = () => {
		if (corporations.length === 0) {
			corporations = shuffle(
				Corporations.slice().filter(c => c.code !== 'starting_corporation')
			)
		}

		return corporations.pop() as Card
	}

	game.players.forEach(p => {
		p.cardsPick = range(0, amount).map(() => nextCorp().code)
		p.state = PlayerStateValue.PickingCorporation
	})
}
