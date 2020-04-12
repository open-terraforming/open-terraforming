import { GameMode, GameModeType } from './types'
import { GameState, PlayerStateValue } from '../game'
import { Card, CardSpecial } from '../cards'
import { shuffle, range } from '../utils'
import { Corporations } from '../corporations'

export const gameMode = (m: GameMode) => m

export const prepareCorporations = (game: GameState, amount = 2) => {
	let corporations = [] as Card[]
	const nextCorp = () => {
		if (corporations.length === 0) {
			corporations = shuffle(
				Corporations.slice().filter(
					c => !c.special.includes(CardSpecial.StartingCorporation)
				)
			)
		}

		return corporations.pop() as Card
	}

	game.players.forEach(p => {
		p.cardsPick = range(0, amount).map(() => nextCorp().code)
		p.state = PlayerStateValue.PickingCorporation
	})
}

export const strToMode = {
	standard: GameModeType.Standard,
	beginner: GameModeType.Beginner
} as const
