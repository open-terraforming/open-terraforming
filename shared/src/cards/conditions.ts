import { getPlayerColoniesCount } from '@shared/expansions/colonies/utils/getPlayerColoniesCount'
import { getPlayerUsedFleets } from '@shared/expansions/colonies/utils/getPlayerUsedFleets'
import { GridCellContent } from '../gameState'
import { progressResToStr, withUnits } from '../units'
import { CardsLookupApi } from './lookup'
import {
	CardCategory,
	CardCondition,
	CardEffectArgumentValue,
	CardResource,
	CardType,
	GameProgress,
	Resource,
	SymbolType,
	WithOptional,
} from './types'
import { countGridContent, progressSymbol, resourceProduction } from './utils'
import { progressHint, tagsCountHint } from './cardHints'

export const condition = <T extends (CardEffectArgumentValue | undefined)[]>(
	c: WithOptional<CardCondition<T>, 'symbols'>,
): CardCondition<T> => ({ symbols: [], ...c })

export const gameCardsCondition = (amount: number) =>
	condition({
		description: `There has to be ${amount} of cards to draw`,
		evaluate: ({ game }) => game.cards.length + game.discarded.length >= amount,
	})

export const playerCardsInHandCondition = (amount: number) =>
	condition({
		description: `Player has to have at least ${amount} of cards in hand`,
		evaluate: ({ player }) => player.cards.length >= amount,
	})

export const cardResourceCondition = (res: CardResource, amount: number) =>
	condition({
		description: `Card has to have at least ${withUnits(res, amount)}`,
		evaluate: ({ card }) => {
			return card[res] >= amount
		},
	})

export const cardResourceAnywhereCondition = (
	res: CardResource,
	amount: number,
) =>
	condition({
		description: `You have have least ${withUnits(res, amount)}`,
		evaluate: ({ player }) => {
			return player.usedCards.reduce((acc, c) => acc + c[res], 0) >= amount
		},
		symbols: [{ cardResource: res, count: amount }],
	})

export const cardAnyResourceCondition = (amount: number) =>
	condition({
		description: `Card has to have at least ${amount} of any resource`,
		evaluate: ({ card }) => {
			const res = CardsLookupApi.get(card.code).resource

			return !!res && card[res] >= amount
		},
	})

export const cardHasCategory = (res: CardCategory) =>
	condition({
		description: `Card has to have ${res} tag`,
		evaluate: ({ card }) =>
			CardsLookupApi.get(card.code).categories.includes(res),
	})

export const cardAcceptsResource = (res: CardResource) =>
	condition({
		description: `Card accepts ${res}`,
		evaluate: ({ card }) => CardsLookupApi.get(card.code).resource === res,
	})

export const cardAcceptsAnyResource = () =>
	condition({
		description: `Card accepts any resource`,
		evaluate: ({ card }) => !!CardsLookupApi.get(card.code).resource,
	})

export const cardCategoryCountCondition = (
	category: CardCategory,
	value: number,
) =>
	condition({
		evaluate: ({ player }) =>
			player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.filter((c) => c.type !== CardType.Event)
				.reduce(
					(acc, c) =>
						acc +
						c.categories.filter((c) => c === category || c === CardCategory.Any)
							.length,
					0,
				) >= value,
		symbols: [{ tag: category, count: value }],
		hints: [tagsCountHint([category])],
		description: `Requires ${value} ${CardCategory[category]} tag(s)`,
	})

export const cardResourcesAnywhereCondition = (
	res: CardResource,
	amount: number,
) =>
	condition({
		description: `Has to have at least ${withUnits(res, amount)} anywhere`,
		symbols: [{ cardResource: res, count: amount }],
		evaluate: ({ player }) => {
			return player.usedCards.reduce((acc, c) => acc + c[res], 0) >= amount
		},
	})

export const joinedCardCountCondition = (
	conditions: { category: CardCategory; value: number }[],
) =>
	condition({
		evaluate: ({ player }) => {
			const usableCards = player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.filter((c) => c.type !== CardType.Event)

			let anyTags = usableCards.reduce(
				(acc, c) =>
					acc + c.categories.filter((c) => c === CardCategory.Any).length,
				0,
			)

			return conditions.every((tag) => {
				const length = usableCards.reduce(
					(acc, c) =>
						acc + c.categories.filter((c) => c === tag.category).length,
					0,
				)

				const diff = tag.value - length

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
		symbols: conditions.map((c) => ({ tag: c.category, count: c.value })),
		hints: [tagsCountHint(conditions.map((c) => c.category))],
		description: `Requires ${conditions
			.map((c) => `${c.value} ${CardCategory[c.category]}`)
			.join(', ')} tag(s)`,
	})

export const gameProgressConditionMin = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game, player, card }) =>
			game[res] >=
			value -
				player.progressConditionBonus -
				CardsLookupApi.get(card.code).categories.reduce(
					(acc, category) =>
						acc + (player.progressConditionBonusByTag[category] ?? 0),
					0,
				),
		symbols: [
			{ ...progressSymbol[res] },
			{ symbol: SymbolType.MoreOrEqual },
			{ text: withUnits(res, value) },
		],
		hints: [progressHint(res)],
		description: `${progressResToStr(res)} has to be at least ${withUnits(
			res,
			value,
		)}`,
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game, player, card }) =>
			game[res] <=
			value +
				player.progressConditionBonus +
				CardsLookupApi.get(card.code).categories.reduce(
					(acc, category) =>
						acc + (player.progressConditionBonusByTag[category] ?? 0),
					0,
				),
		symbols: [
			{ ...progressSymbol[res] },
			{ symbol: SymbolType.LessOrEqual },
			{ text: withUnits(res, value) },
		],
		hints: [progressHint(res)],
		description: `${progressResToStr(res)} has to be at most ${withUnits(
			res,
			value,
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
		symbols: [{ tile: type, count: amount }],
		evaluate: ({ game }) => countGridContent(game, type) >= amount,
	})

export const ownedCellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} ${GridCellContent[type]} to be placed by you`,
		symbols: [{ tile: type, count: amount }],
		evaluate: ({ game, player }) =>
			countGridContent(game, type, player.id) >= amount,
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]

	return condition({
		evaluate: ({ player }) => player[prod] >= value,
		description: `Your ${res} production has to be at least ${value}`,
	})
}

const protectedHabitatResources: CardResource[] = ['animals', 'microbes']

export const unprotectedCard = () =>
	condition({
		evaluate: ({ card, player }) => {
			const info = CardsLookupApi.get(card.code)

			return (
				info.resourceProtected === undefined &&
				(!player.protectedHabitat ||
					!protectedHabitatResources.includes(info.resource as CardResource))
			)
		},
	})

export const unprotectedPlayerResource = (res: Resource) =>
	condition({
		evaluate: ({ player }) => res !== 'plants' || !player.protectedHabitat,
	})

export const terraformRatingMin = (value: number) =>
	condition({
		evaluate: ({ player }) => player.terraformRating >= value,
		symbols: [{ symbol: SymbolType.TerraformingRating, count: value }],
		description: `Requires ${value} TR`,
	})

export const tradeFleeCountCondition = (value: number) =>
	condition({
		evaluate: ({ player }) => player.tradeFleets >= value,
		description: `Requires ${value} trade fleets`,
		symbols: [{ symbol: SymbolType.TradeFleet, count: value }],
	})

export const playerMinColonyCountCondition = (value: number) =>
	condition({
		evaluate: ({ player, game }) =>
			getPlayerColoniesCount({ player, game }) >= value,
		description: `Requires ${value} owned colonies`,
		symbols: [{ symbol: SymbolType.Colony, count: value }],
	})

export const playerMaxColonyCountCondition = (value: number) =>
	condition({
		evaluate: ({ player, game }) =>
			getPlayerColoniesCount({ player, game }) <= value,
		description: `Requires at most ${value} owned colonies`,
		symbols: [
			{ symbol: SymbolType.Colony },
			{ symbol: SymbolType.LessOrEqual },
			{ text: value.toString() },
		],
	})

export const playerHasUnusedFleet = () =>
	condition({
		evaluate: ({ player, game }) =>
			getPlayerUsedFleets(game, player).length < player.tradeFleets,
		description: `Requires unused trade fleet`,
	})
