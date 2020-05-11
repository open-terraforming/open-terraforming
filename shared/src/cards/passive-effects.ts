import { GridCellContent, GridCellOther, StandardProjectType } from '../game'
import { playCardAction } from '../player-actions'
import { withUnits } from '../units'
import { adjacentCells, f, pushPendingAction } from '../utils'
import { effectArg } from './args'
import { effect } from './effects'
import { CardsLookupApi } from './lookup'
import {
	CardCategory,
	CardEffect,
	CardEffectTarget,
	CardPassiveEffect,
	CardResource,
	Resource,
	SymbolType,
	WithOptional,
	CardSymbol
} from './types'
import { gamePlayer, resourceProduction, updatePlayerResource } from './utils'
import { tileWithArticle } from '../texts'

export const passiveEffect = (
	e: WithOptional<CardPassiveEffect, 'symbols'>
): CardPassiveEffect => ({ symbols: [], ...e })

export const resourcePerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When anyone places ${tileWithArticle(
			content
		)} tile, gain ${withUnits(res, amount)}`,
		symbols: [
			{ tile: content, other: true },
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount }
		],
		onTilePlaced: ({ player }, cell) => {
			if (cell.content === content) {
				player[res] += amount
			}
		}
	})

export const productionPerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When anyone places ${tileWithArticle(
			content
		)} tile, increase ${res} production by ${amount}`,
		symbols: [
			{ tile: content, other: true },
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount, production: true }
		],
		onTilePlaced: ({ player }, cell) => {
			if (cell.content === content) {
				player[resourceProduction[res]] += amount
			}
		}
	})

export const resourcePerCardPlayed = (
	categories: CardCategory[],
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map(c => CardCategory[c])
			.join(' ')} card, you gain ${withUnits(res, amount)}`,
		symbols: [
			...categories.reduce(
				(acc, c) => [
					...acc,
					...(acc.length > 0 ? [{ symbol: SymbolType.Plus }] : []),
					{ tag: c }
				],
				[] as CardSymbol[]
			),
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount }
		],
		onCardPlayed: ({ player }, card, _cardIndex, playedBy) => {
			if (
				playedBy.id === player.id &&
				categories.every(c => card.categories.includes(c))
			) {
				player[res] += amount
			}
		}
	})

export const cardResourcePerCardPlayed = (
	categories: CardCategory[],
	res: CardResource,
	amount: number
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map(c => CardCategory[c])
			.join(' or ')} card, place ${amount} ${res} on this card`,
		symbols: [
			...categories.map(c => ({ tag: c })),
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount }
		],
		onCardPlayed: ({ card: cardState, player }, card, _cardIndex, playedBy) => {
			if (
				playedBy.id === player.id &&
				categories.find(c => card.categories.includes(c))
			) {
				cardState[res] += amount
			}
		}
	})

export const cardResourcePerTilePlaced = (
	tile: GridCellContent,
	res: CardResource,
	amount: number
) =>
	passiveEffect({
		description: `When you place a ${GridCellContent[tile]} tile, place ${amount} of ${res} on this card`,
		symbols: [
			{ tile },
			{ symbol: SymbolType.Colon },
			{ cardResource: res, count: amount }
		],
		onTilePlaced: ({ player, card }, cell, playedBy) => {
			if (playedBy.id === player.id && cell.content === tile) {
				card[res] += amount
			}
		}
	})

export const productionChangeAfterPlace = (
	amount: number,
	type: GridCellOther
) =>
	passiveEffect({
		description: `Your production of resource which has bonus on selected tile will increase by ${amount}`,
		onTilePlaced: ({ player, card }, cell) => {
			if (card.data) {
				return
			}

			if (cell.other === type) {
				const best = (['titan', 'ore', 'heat'] as const).find(r => cell[r] > 0)

				if (best !== undefined) {
					player[resourceProduction[best]] += amount
				}

				card.data = true
			}
		}
	})

export const cardExchangeEffect = (tag: CardCategory) =>
	passiveEffect({
		description: `Action is triggered when you play a ${CardCategory[tag]} card`,
		onCardPlayed: (
			{ player, card },
			playedCard,
			_playedCardIndex,
			playedBy
		) => {
			if (
				CardsLookupApi.get(playedCard.code).categories.includes(tag) &&
				playedBy.id === player.id
			) {
				pushPendingAction(player, playCardAction(card.index))
			}
		}
	})

export const playWhenCard = (tags: CardCategory[]) =>
	passiveEffect({
		description: `Action triggered when you play ${tags
			.map(t => CardCategory[t])
			.join(' or ')} card`,
		onCardPlayed: (
			{ player, card: cardState },
			playedCard,
			playedCardIndex,
			playedBy
		) => {
			if (
				player.id === playedBy.id &&
				tags.find(t => playedCard.categories.includes(t))
			) {
				cardState.triggeredByCard = playedCardIndex
				pushPendingAction(player, playCardAction(cardState.index))
			}
		}
	})

export const resourceForStandardProject = (res: Resource, amount: number) => {
	const ignoredProjects = [
		StandardProjectType.SellPatents,
		StandardProjectType.GreeneryForPlants,
		StandardProjectType.TemperatureForHeat
	]

	return passiveEffect({
		description: f(
			`Receive {0} when playing any Standard project (except selling patents)`,
			withUnits(res, amount)
		),
		onStandardProject: ({ player }, project, playedBy) => {
			if (
				playedBy.id === player.id &&
				!ignoredProjects.includes(project.type)
			) {
				updatePlayerResource(player, res, amount)
			}
		}
	})
}

export const resetProgressBonus = (amount: number) =>
	passiveEffect({
		description:
			amount < 30
				? f(
						`The next card you play this generation is +{0} or -{1} steps in global requirements, your choice.`,
						amount,
						amount
				  )
				: 'Ignore global requirements for the next card you play this generation.',
		onCardPlayed: ({ player, card }, playedCard, _cardIndex, playedBy) => {
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
		}
	})

export const resetCardPriceChange = (amount: number) =>
	passiveEffect({
		description: f(
			`The next card you play this generation costs {0} MC less.`,
			-amount
		),
		onCardPlayed: ({ player, card }, playedCard, _cardIndex, playedBy) => {
			if (
				playedBy.id === player.id &&
				card.code !== playedCard.code &&
				card.data === undefined
			) {
				player.cardPriceChange -= amount
				card.data = true
			}
		},
		onGenerationEnd: ({ player, card }) => {
			if (card.data === undefined) {
				player.cardPriceChange -= amount
				card.data = true
			}
		}
	})

export const asFirstAction = (effect: CardEffect) =>
	passiveEffect({
		description: '',
		onGenerationStarted: (ctx, generation) => {
			if (generation === 1) {
				effect.perform(ctx)
			}
		}
	})

export const changeResourceFromNeighbor = (res: Resource, amount: number) => ({
	action: effect({
		args: [
			effectArg({
				type: CardEffectTarget.Player,
				optional: true,
				resource: res,
				playerConditions: [
					{
						symbols: [],
						evaluate: ({ player, card }) => card.data?.includes(player.id)
					}
				]
			})
		],
		perform: ({ game }, playerId: number) => {
			if (playerId >= 0) {
				updatePlayerResource(gamePlayer(game, playerId), res, amount)
			}
		}
	}),
	effect: passiveEffect({
		description: f(
			amount < 0
				? 'You may remove {0} from one of the owners of adjacent tiles'
				: 'You may give {0} to one of the owners of adjacent tiles',
			withUnits(res, Math.abs(amount))
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
		}
	})
})
