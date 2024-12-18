import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { PLAYER_PRODUCTION_TO_RESOURCE } from '../constants'
import {
	GridCellContent,
	GridCellOther,
	StandardProjectType,
} from '../gameState'
import { playCardAction } from '../player-actions'
import { tileWithArticle } from '../texts'
import { withUnits } from '../units'
import { adjacentCells } from '@shared/utils/adjacentCells'
import { drawCard } from '@shared/utils/drawCard'
import { f } from '@shared/utils/f'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { range } from '@shared/utils/range'
import { effectArg } from './args'
import { effect } from './effects/types'
import { CardsLookupApi } from './lookup'
import {
	CardCategory,
	CardEffect,
	CardPassiveEffect,
	CardResource,
	CardSymbol,
	GameProgress,
	Resource,
	SymbolType,
	WithOptional,
} from './types'
import { CardEffectArgumentType } from './args'
import {
	gamePlayer,
	progressSymbol,
	resourceProduction,
	updatePlayerResource,
} from './utils'

export const passiveEffect = (
	e: WithOptional<CardPassiveEffect, 'symbols'>,
): CardPassiveEffect => ({ symbols: [], ...e })

export const resourcePerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number,
) =>
	passiveEffect({
		description: `When anyone places ${tileWithArticle(
			content,
		)} tile, gain ${withUnits(res, amount)}`,
		symbols: [
			{ tile: content, other: true },
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount },
		],
		onTilePlaced: ({ player }, cell) => {
			if (cell.content === content) {
				player[res] += amount
			}
		},
	})

export const productionPerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number,
) =>
	passiveEffect({
		description: `When anyone places ${tileWithArticle(
			content,
		)} tile, increase ${res} production by ${amount}`,
		symbols: [
			{ tile: content, other: true },
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount, production: true },
		],
		onTilePlaced: ({ player }, cell) => {
			if (cell.content === content) {
				player[resourceProduction[res]] += amount
			}
		},
	})

export const resourcePerCardPlayed = (
	categories: CardCategory[],
	res: Resource,
	amount: number,
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map((c) => CardCategory[c])
			.join(' ')} card, you gain ${withUnits(res, amount)}`,
		symbols: [
			...categories.reduce(
				(acc, c) => [
					...acc,
					...(acc.length > 0 ? [{ symbol: SymbolType.Plus }] : []),
					{ tag: c },
				],
				[] as CardSymbol[],
			),
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount },
		],
		onCardBought: ({ player }, card, _cardIndex, playedBy) => {
			// TODO: This is probably fine, since we're using AND and it's always about EVENT cards
			if (
				playedBy.id === player.id &&
				categories.every((c) => card.categories.includes(c))
			) {
				player[res] += amount
			}
		},
	})

export const cardResourcePerCardPlayed = (
	categories: CardCategory[],
	res: CardResource,
	amount: number,
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map((c) => CardCategory[c])
			.join(' or ')} card, place ${amount} ${res} on this card`,
		symbols: [
			...categories.map((c) => ({ tag: c })),
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount },
		],
		onCardBought: ({ card: cardState, player }, card, _cardIndex, playedBy) => {
			if (playedBy.id === player.id) {
				const matchingTags = card.categories.filter((c) =>
					categories.includes(c),
				).length

				if (matchingTags > 0) {
					cardState[res] += matchingTags * amount
				}
			}
		},
	})

export const cardResourcePerTilePlaced = (
	tile: GridCellContent,
	res: CardResource,
	amount: number,
) =>
	passiveEffect({
		description: `When you place a ${GridCellContent[tile]} tile, place ${amount} of ${res} on this card`,
		symbols: [
			{ tile },
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount },
		],
		onTilePlaced: ({ player, card }, cell, playedBy) => {
			if (playedBy.id === player.id && cell.content === tile) {
				card[res] += amount
			}
		},
	})

export const cardResourcePerAnybodyTilePlaced = (
	tile: GridCellContent,
	res: CardResource,
	amount: number,
) =>
	passiveEffect({
		description: `When anybody places a ${GridCellContent[tile]} tile, place ${amount} of ${res} on this card`,
		symbols: [
			{ tile },
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount },
		],
		onTilePlaced: ({ card }, cell) => {
			if (cell.content === tile) {
				card[res] += amount
			}
		},
	})

export const cardResourcePerSelfTagPlayed = (
	tag: CardCategory | CardCategory[],
	res: CardResource,
	amount: number,
) => {
	const tags = Array.isArray(tag) ? tag : [tag]

	return passiveEffect({
		description: `When you play ${tags.map((tag) => CardCategory[tag]).join(' or ')}, place ${amount > 1 ? `${amount} of ${res}` : res} on this card`,
		symbols: [
			...tags.map((tag) => ({ tag })),
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount },
		],
		onCardBought: ({ player, card }, playedCard, _, playedBy) => {
			if (playedBy.id !== player.id) {
				return
			}

			const matches = playedCard.categories.filter((t) =>
				tags.includes(t),
			).length

			card[res] += matches * amount
		},
	})
}

export const productionChangeAfterPlace = (
	amount: number,
	type: GridCellOther,
) =>
	passiveEffect({
		description: `Your production of resource which has bonus on selected tile will increase by ${amount}`,
		onTilePlaced: ({ player, card }, cell) => {
			if (card.data) {
				return
			}

			if (cell.other === type) {
				const best = (['titan', 'ore', 'heat'] as const).find(
					(r) => cell[r] > 0,
				)

				if (best !== undefined) {
					player[resourceProduction[best]] += amount
				}

				card.data = true
			}
		},
	})

export const cardExchangeEffect = (tag: CardCategory) =>
	passiveEffect({
		description: `Action is triggered when you play a ${CardCategory[tag]} tag`,
		onCardBought: (
			{ player, card },
			playedCard,
			_playedCardIndex,
			playedBy,
		) => {
			if (playedBy.id === player.id) {
				const matchingTags = CardsLookupApi.get(
					playedCard.code,
				).categories.filter((t) => t === tag).length

				range(0, matchingTags).forEach(() => {
					pushPendingAction(player, playCardAction(card.index))
				})
			}
		},
	})

export const playWhenCard = (tags: CardCategory[]) =>
	passiveEffect({
		description: `Action triggered when you play ${tags
			.map((t) => CardCategory[t])
			.join(' or ')} tag`,
		onCardBought: (
			{ player, card: cardState },
			playedCard,
			playedCardIndex,
			playedBy,
		) => {
			if (player.id === playedBy.id) {
				const matchingTags = playedCard.categories.filter((t) =>
					tags.includes(t),
				).length

				if (matchingTags > 0) {
					// TODO: This should be fine as long as any of the triggered effects don't change this value
					cardState.triggeredByCard = playedCardIndex

					range(0, matchingTags).forEach(() => {
						pushPendingAction(player, playCardAction(cardState.index))
					})
				}
			}
		},
	})

export const resourceForStandardProject = (res: Resource, amount: number) => {
	const ignoredProjects = [
		StandardProjectType.SellPatents,
		StandardProjectType.GreeneryForPlants,
		StandardProjectType.TemperatureForHeat,
	]

	return passiveEffect({
		description: f(
			`Receive {0} when playing any Standard project (except selling patents)`,
			withUnits(res, amount),
		),
		onStandardProject: ({ player }, project, playedBy) => {
			if (
				playedBy.id === player.id &&
				!ignoredProjects.includes(project.type)
			) {
				updatePlayerResource(player, res, amount)
			}
		},
	})
}

export const resourceForProgress = (
	progress: GameProgress,
	res: Resource,
	amount: number,
) => {
	return passiveEffect({
		description: f(
			`Receive {0} when ${progress} is increased`,
			withUnits(res, amount),
		),
		symbols: [
			progressSymbol[progress],
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount },
		],
		onProgress: ({ player }, p) => {
			if (p === progress) {
				updatePlayerResource(player, res, amount)
			}
		},
	})
}

export const oneTimeProgressBonus = (amount: number) =>
	passiveEffect({
		description:
			amount < 30
				? f(
						`The next card you play this generation is +{0} or -{1} steps in global requirements, your choice.`,
						amount,
						amount,
					)
				: 'Ignore global requirements for the next card you play this generation.',
		onPlay: ({ player }) => (player.progressConditionBonus += amount),
		onCardBought: ({ player, card }, playedCard, _cardIndex, playedBy) => {
			if (
				playedBy.id === player.id &&
				card.code !== playedCard.code &&
				card.data === undefined
			) {
				player.progressConditionBonus -= amount
				card.data = true
			}
		},
		onGenerationEnd: ({ player, card }) => {
			if (card.data === undefined) {
				player.progressConditionBonus -= amount
				card.data = true
			}
		},
	})

export const oneTimeCardPriceChange = (amount: number) =>
	passiveEffect({
		description: f(
			`The next card you play this generation costs {0} MC less.`,
			-amount,
		),
		onPlay: ({ player, card }) => {
			player.cardPriceChanges.push({
				change: amount,
				sourceCardIndex: card.index,
			})
		},
		onCardBought: ({ player, card }, playedCard, _cardIndex, playedBy) => {
			if (
				playedBy.id === player.id &&
				card.code !== playedCard.code &&
				card.data === undefined
			) {
				player.cardPriceChanges = player.cardPriceChanges.filter(
					(item) => item.sourceCardIndex !== card.index,
				)

				card.data = true
			}
		},
		onGenerationEnd: ({ player, card }) => {
			if (card.data === undefined) {
				player.cardPriceChanges = player.cardPriceChanges.filter(
					(item) => item.sourceCardIndex !== card.index,
				)

				card.data = true
			}
		},
	})

export const asFirstAction = (effect: CardEffect) =>
	passiveEffect({
		description: '',
		onGenerationStarted: (ctx, generation) => {
			if (generation === 1) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				effect.perform(ctx, ...([] as any))
			}
		},
	})

export const changeResourceFromNeighbor = (res: Resource, amount: number) => ({
	action: effect({
		args: [
			effectArg({
				type: CardEffectArgumentType.Player as const,
				optional: true,
				resource: res,
				playerConditions: [
					{
						symbols: [],
						evaluate: ({ player, card }) => card.data?.includes(player.id),
					},
				],
			}),
		],
		perform: ({ game }, playerId: number) => {
			if (playerId >= 0) {
				const target = gamePlayer(game, playerId)
				// Check how much money can we actually remove
				const value = amount < 0 ? Math.max(amount, -target[res]) : amount

				updatePlayerResource(gamePlayer(game, playerId), res, value)
			}
		},
	}),
	effect: passiveEffect({
		description: f(
			amount < 0
				? 'You may remove {0} from one of the owners of adjacent tiles'
				: 'You may give {0} to one of the owners of adjacent tiles',
			withUnits(res, Math.abs(amount)),
		),
		onTilePlaced: ({ game, player, card }, cell, placedBy) => {
			if (card.data || placedBy.id !== player.id) {
				return
			}

			card.data = adjacentCells(game, cell.x, cell.y).reduce((acc, c) => {
				if (
					c.ownerId !== undefined &&
					c.ownerId !== player.id &&
					!acc.includes(c.ownerId)
				) {
					acc.push(c.ownerId)
				}

				return acc
			}, [] as number[])

			pushPendingAction(player, playCardAction(card.index))
		},
	}),
})

export const emptyPassiveEffect = (
	description: string,
	symbols: CardSymbol[] = [],
) =>
	passiveEffect({
		description,
		symbols,
	})

export const resourceForProductionChange = (amount = 1) =>
	passiveEffect({
		description: `When you increase production of a resource, receive ${amount} of that resource`,
		onPlayerProductionChanged: (
			{ player: currentPlayer },
			player,
			production,
			change,
		) => {
			if (player.id !== currentPlayer.id || change <= 0) {
				return
			}

			const resource = PLAYER_PRODUCTION_TO_RESOURCE[production]

			updatePlayerResource(player, resource, amount * change)
		},
	})

export const drawCardWhenBuyingCard = (minCardCost: number) =>
	passiveEffect({
		description: `When playing card with basic cost of ${minCardCost}$ or more, draw a card`,
		symbols: [
			{ resource: 'money', count: minCardCost },
			{ symbol: SymbolType.Colon },
			{ symbol: SymbolType.Card },
		],
		onCardBought: ({ player, game }, card, _, playedBy) => {
			if (player.id === playedBy.id && card.cost >= minCardCost) {
				player.cards.push(drawCard(game))
			}
		},
	})

export const increaseIncomeStepBeforeTrading = (amount: number) =>
	passiveEffect({
		description: `Increase income step by ${amount} before trading with a colony`,
		onBeforeColonyTrade: ({ player: currentPlayer }, playedBy, colony) => {
			if (playedBy.id !== currentPlayer.id) {
				return
			}

			colony.step = Math.min(
				ColoniesLookupApi.get(colony.code).tradeIncome.slots.length - 1,
				colony.step + amount,
			)
		},
	})

export const orePriceChange = (change: number) =>
	passiveEffect({
		description: `Ore is worth ${withUnits('money', change)} extra`,
		symbols: [
			{ resource: 'ore' as const },
			{ symbol: SymbolType.Colon },
			{ resource: 'money' as const, count: 1, forceSign: true },
		],
		onPlay: ({ player }) => {
			player.orePrice += change
		},
	})

export const titanPriceChange = (change: number) =>
	passiveEffect({
		description: `Titan is worth ${withUnits('money', change)} extra`,
		symbols: [
			{ resource: 'titan' as const },
			{ symbol: SymbolType.Colon },
			{ resource: 'money' as const, count: 1, forceSign: true },
		],
		onPlay: ({ player }) => {
			player.titanPrice += change
		},
	})

export const changeProgressConditionBonus = (change: number) =>
	passiveEffect({
		description: f(
			'Your global requirements are +{0} or -{1} steps, your choice in each case',
			change,
			change,
		),
		onPlay: ({ player }) => (player.progressConditionBonus += change),
	})

export const changeProgressConditionBonusPerTag = (
	category: CardCategory,
	change: number,
) =>
	passiveEffect({
		description: f(
			'Your global requirements are +{0} or -{1} steps (your choice) for cards with {2} tag',
			change,
			change,
			CardCategory[category],
		),
		onPlay: ({ player }) => {
			if (!player.progressConditionBonusByTag[category]) {
				player.progressConditionBonusByTag[category] = change
			} else {
				player.progressConditionBonusByTag[category] += change
			}
		},
	})
