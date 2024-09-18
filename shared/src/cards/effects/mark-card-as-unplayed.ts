import { cardArg } from '../args'
import { effect } from './types'

export const markCardAsUnplayed = effect({
	description: 'Mark already used action card as un-played',
	args: [
		cardArg([
			{
				description: 'Card was played',
				symbols: [],
				evaluate: ({ card }) => card.played,
			},
		]),
	],
	conditions: [
		{
			symbols: [],
			evaluate: ({ player }) => player.usedCards.some((card) => card.played),
		},
	],
	perform: ({ player }, cardIndex) => {
		player.usedCards[cardIndex as number].played = false
	},
})
