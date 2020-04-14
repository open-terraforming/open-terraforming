import { GameState, PlayerStateValue } from '../game'
import { range, drawCorporation } from '../utils'
import { GameMode, GameModeType } from './types'
import { CardsLookupApi, CardSpecial } from '../cards'

export const gameMode = (m: GameMode) => m

export const prepareCorporations = (game: GameState, amount = 2) => {
	const startingCorp = Object.values(CardsLookupApi.data()).find(c =>
		c.special.includes(CardSpecial.StartingCorporation)
	)

	if (!startingCorp) {
		throw new Error('Failed to find starting corporation')
	}

	game.corporations = game.corporations.filter(c => c !== startingCorp.code)

	game.players.forEach(p => {
		p.cardsPick = []
		try {
			range(0, amount).forEach(() => {
				p.cardsPick.push(drawCorporation(game))
			})
		} catch (e) {
			if (p.cardsPick.length === 0) {
				p.cardsPick.push(startingCorp.code)
			}
		}

		p.state = PlayerStateValue.PickingCorporation
	})
}

export const strToMode = {
	standard: GameModeType.Standard,
	beginner: GameModeType.Beginner
} as const
