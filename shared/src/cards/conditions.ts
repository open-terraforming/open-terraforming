import {
	CardEffectArgumentType,
	CardCondition,
	CardResource,
	CardCategory,
	GameProgress,
	Resource,
} from './types'
import { progressResToStr, withUnits } from '../units'
import { GridCellContent } from '../game'
import { countGridContent, resourceProduction } from './utils'
import { CardsLookupApi } from './lookup'

export const condition = <T extends (CardEffectArgumentType | undefined)[]>(
	c: CardCondition<T>
): CardCondition<T> => c

export const cardResourceCondition = (res: CardResource, amount: number) =>
	condition({
		description: `Card has to have at least ${amount} of ${res} units`,
		evaluate: ({ card }) => {
			console.log(card[res], amount, card)
			return card[res] >= amount
		},
	})

export const cardHasResource = (res: CardResource) =>
	condition({
		description: `Card accepts ${res}`,
		evaluate: ({ card }) => CardsLookupApi.get(card.code).resource === res,
	})

export const cardCountCondition = (category: CardCategory, value: number) =>
	condition({
		evaluate: ({ player }) =>
			player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.filter((c) => c && c.categories.includes(category)).length >= value,
		description: `Requires ${value} ${CardCategory[category]} cards`,
	})

export const gameProgressConditionMin = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game }) => game[res] >= value,
		description: `${progressResToStr(res)} has to be at least ${withUnits(
			res,
			value
		)}`,
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game }) => game[res] <= value,
		description: `${progressResToStr(res)} has to be at most ${withUnits(
			res,
			value
		)}`,
	})

export const resourceCondition = (res: Resource, value: number) =>
	condition({
		evaluate: ({ player }) => player[res] >= value,
		description: `You have to have at least ${withUnits(res, value)}`,
	})

export const cellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} ${GridCellContent[type]} to be placed by anybody`,
		evaluate: ({ game }) => countGridContent(game, type) >= amount,
	})

export const ownedCellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} ${GridCellContent[type]} to be placed by you`,
		evaluate: ({ game, playerId }) =>
			countGridContent(game, type, playerId) >= amount,
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]
	return condition({
		evaluate: ({ player }) => player[prod] >= value,
		description: `Your ${res} production has to be at least ${value}`,
	})
}
