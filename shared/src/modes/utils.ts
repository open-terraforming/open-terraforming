import { CardsLookupApi, CardSpecial } from '../cards'
import { GameState, PlayerStateValue } from '../game'
import { pickStartingAction } from '../player-actions'
import {
	drawCards,
	drawCorporation,
	drawPreludeCards,
	pushPendingAction,
	range
} from '../utils'
import { GameMode, GameModeType } from './types'

export const gameMode = (m: GameMode) => m

export const prepareStartingPick = (
	game: GameState,
	{
		corporations = 2,
		cards = 10,
		preludes = 4,
		preludesLimit = 2
	}: {
		corporations?: number
		cards?: number
		preludes?: number
		preludesLimit?: number
	} = {}
) => {
	const startingCorp = Object.values(CardsLookupApi.data()).find(c =>
		c.special.includes(CardSpecial.StartingCorporation)
	)

	if (!startingCorp) {
		throw new Error('Failed to find starting corporation')
	}

	game.corporations = game.corporations.filter(c => c !== startingCorp.code)

	game.players.forEach(p => {
		const corpCards: string[] = []

		try {
			range(0, corporations).forEach(() => {
				corpCards.push(drawCorporation(game))
			})
		} catch (e) {
			if (corpCards.length === 0) {
				corpCards.push(startingCorp.code)
			}
		}

		pushPendingAction(
			p,
			pickStartingAction(
				corpCards,
				drawCards(game, cards),
				game.prelude ? drawPreludeCards(game, preludes) : [],
				game.prelude ? preludesLimit : 0
			)
		)

		p.state = PlayerStateValue.Picking
	})
}

export const strToMode = {
	standard: GameModeType.Standard,
	beginner: GameModeType.Beginner
} as const
