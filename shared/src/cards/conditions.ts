import { GridCellContent } from '../game'
import { progressResToStr, withUnits } from '../units'
import { CardsLookupApi } from './lookup'
import {
	CardCategory,
	CardCondition,
	CardEffectArgumentType,
	CardResource,
	GameProgress,
	Resource
} from './types'
import { countGridContent, resourceProduction } from './utils'

export const condition = <T extends (CardEffectArgumentType | undefined)[]>(
	c: CardCondition<T>
): CardCondition<T> => c

export const gameCardsCondition = (amount: number) =>
	condition({
		description: `There has to be ${amount} of cards to draw`,
		evaluate: ({ game }) => game.cards.length + game.discarded.length >= amount
	})

export const cardResourceCondition = (res: CardResource, amount: number) =>
	condition({
		description: `Card has to have at least ${amount} of ${res} units`,
		evaluate: ({ card }) => {
			return card[res] >= amount
		}
	})

export const cardHasResource = (res: CardResource) =>
	condition({
		description: `Card accepts ${res}`,
		evaluate: ({ card }) => CardsLookupApi.get(card.code).resource === res
	})

export const cardCountCondition = (category: CardCategory, value: number) =>
	condition({
		evaluate: ({ player }) =>
			player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) =>
						acc +
						c.categories.filter(c => c === category || c === CardCategory.Any)
							.length,
					0
				) >= value,
		description: `Requires ${value} ${CardCategory[category]} tag(s)`
	})

export const joinedCardCountCondition = (
	conditions: { category: CardCategory; value: number }[]
) =>
	condition({
		evaluate: ({ player }) => {
			let anyTags = player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) =>
						acc + c.categories.filter(c => c === CardCategory.Any).length,
					0
				)

			return conditions.every(cond => {
				const length = player.usedCards
					.map(c => CardsLookupApi.get(c.code))
					.reduce(
						(acc, c) =>
							acc + c.categories.filter(c => c === cond.category).length,
						0
					)

				const diff = cond.value - length
				if (diff <= 0) {
					return true
				}

				if (diff > anyTags) {
					return false
				}

				anyTags -= diff
				return true
			})
		},
		description: `Requires ${conditions
			.map(c => `${c.value} ${CardCategory[c.category]}`)
			.join(', ')} tag(s)`
	})

export const gameProgressConditionMin = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game, player }) =>
			game[res] >= value - player.progressConditionBonus,
		description: `${progressResToStr(res)} has to be at least ${withUnits(
			res,
			value
		)}`
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game, player }) =>
			game[res] <= value + player.progressConditionBonus,
		description: `${progressResToStr(res)} has to be at most ${withUnits(
			res,
			value
		)}`
	})

export const resourceCondition = (res: Resource, value: number) =>
	condition({
		evaluate: ({ player }) => player[res] >= value,
		description: `You have to have at least ${withUnits(res, value)}`
	})

export const cellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} ${GridCellContent[type]} to be placed by anybody`,
		evaluate: ({ game }) => countGridContent(game, type) >= amount
	})

export const ownedCellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} ${GridCellContent[type]} to be placed by you`,
		evaluate: ({ game, playerId }) =>
			countGridContent(game, type, playerId) >= amount
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]
	return condition({
		evaluate: ({ player }) => player[prod] >= value,
		description: `Your ${res} production has to be at least ${value}`
	})
}

export const unprotectedCard = () =>
	condition({
		evaluate: ({ card }) =>
			CardsLookupApi.get(card.code).resourceProtected === undefined
	})
