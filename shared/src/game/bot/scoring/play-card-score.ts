import { Card, CardCategory } from '@shared/cards'
import { adjustedCardPrice, emptyCardState } from '@shared/cards/utils'
import { getBestArgs } from './getBestArgs'
import { ScoringContext } from './types'
import { copyGame } from './utils'

export const playCardScore = (
	{ scoring, player, game }: ScoringContext,
	card: Card,
) => {
	const cardState = emptyCardState(card.code)

	// Add some resources to the card state so its effects can be evaluated properly
	// TODO: Is this good idea? Should this be configurable by coefficients?
	if (card.resource) {
		cardState[card.resource] = 6
	}

	const { gameCopy, playerCopy } = copyGame(game, player)

	// Simulate card being played
	playerCopy.cards = playerCopy.cards.filter((c) => c !== card.code)
	playerCopy.usedCards.push(cardState)

	let cost = adjustedCardPrice(card, playerCopy)
	let ore = playerCopy.ore
	let titan = playerCopy.titan

	if (card.categories.includes(CardCategory.Building)) {
		const useOre = Math.min(ore, Math.ceil(cost / playerCopy.orePrice))
		ore -= useOre
		cost -= useOre * playerCopy.orePrice
	}

	if (card.categories.includes(CardCategory.Space)) {
		const useTitan = Math.min(titan, Math.ceil(cost / playerCopy.titanPrice))
		titan -= useTitan
		cost -= useTitan * playerCopy.titanPrice
	}

	playerCopy.money -= cost
	playerCopy.titan = titan
	playerCopy.ore = ore

	// Apply passive effects if there're any to be applied
	for (const effect of card.passiveEffects) {
		if (effect.onPlay) {
			effect.onPlay({
				player: playerCopy,
				game: gameCopy,
				card: cardState,
			})
		}
	}

	try {
		const best = getBestArgs(
			scoring,
			gameCopy,
			playerCopy,
			cardState,
			card.playEffects,
		)

		return {
			score: best.score,
			args: best.args,
		}
	} catch {
		// TODO: Log this error
		return {
			score: 0,
			args: [],
		}
	}
}
