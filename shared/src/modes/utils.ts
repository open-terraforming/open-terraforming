import { CardsLookupApi, CardSpecial } from '../cards'
import { GameState } from '../game'
import { pickCorporationAction } from '../player-actions'
import { pushPendingAction } from '../utils'
import { GameMode, GameModeType } from './types'

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
		const cards: string[] = []

		/*
		try {
			range(0, amount).forEach(() => {
				cards.push(drawCorporation(game))
			})
		} catch (e) {
			if (cards.length === 0) {
				cards.push(startingCorp.code)
			}
		}
		*/

		cards.push(...game.corporations)

		pushPendingAction(p, pickCorporationAction(cards))
	})
}

export const strToMode = {
	standard: GameModeType.Standard,
	beginner: GameModeType.Beginner
} as const
