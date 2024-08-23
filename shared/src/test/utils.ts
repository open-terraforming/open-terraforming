import { initialGameState, initialPlayerState } from '../states'
import { range } from '../utils'
import { Card, CardType } from '../cards'
import { card } from '../cards/utils'

export const prepareTestState = (players = 2) => {
	const game = initialGameState()

	range(0, players).forEach((i) => {
		game.players.push(initialPlayerState(i + 1))
	})

	return game
}

export const prepareTestCard = (props: Partial<Card>) =>
	card({
		code: 'test',
		categories: [],
		cost: 0,
		type: CardType.Building,
		...props,
	})
