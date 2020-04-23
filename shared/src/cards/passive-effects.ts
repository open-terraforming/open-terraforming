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
	WithOptional
} from './types'
import { gamePlayer, resourceProduction, updatePlayerResource } from './utils'

export const passiveEffect = (
	e: WithOptional<CardPassiveEffect, 'symbols'>
): CardPassiveEffect => ({ symbols: [], ...e })

export const resourcePerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When anyone places an ${
			GridCellContent[content]
		} tile, gain ${withUnits(res, amount)}`,
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
		description: `When anyone places an ${GridCellContent[content]} tile, increase ${res} production by ${amount}`,
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
			...categories.map(c => ({ tag: c })),
			{ symbol: SymbolType.Colon },
			{ resource: res, count: amount }
		],
		onCardPlayed: ({ player, playerId }, card, _cardIndex, playedBy) => {
			if (
				playedBy.id === playerId &&
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
		onCardPlayed: (
			{ playerId, card: cardState },
			card,
			_cardIndex,
			playedBy
		) => {
			if (
				playedBy.id === playerId &&
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
		onTilePlaced: ({ playerId, card }, cell, playedBy) => {
			if (playedBy.id === playerId && cell.content === tile) {
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
				const res = cell.titan > 0 ? 'titan' : 'ore'
				player[resourceProduction[res]] += amount
				card.data = true
			}
		}
	})

export const cardExchangeEffect = (tag: CardCategory) =>
	passiveEffect({
		description: `Action is triggered when you play a ${CardCategory[tag]} card`,
		onCardPlayed: (
			{ player, playerId, cardIndex },
			playedCard,
			_playedCardIndex,
			playedBy
		) => {
			if (
				CardsLookupApi.get(playedCard.code).categories.includes(tag) &&
				playedBy.id === playerId
			) {
				pushPendingAction(player, playCardAction(cardIndex))
			}
		}
	})

export const playWhenCard = (tags: CardCategory[]) =>
	passiveEffect({
		description: `Action triggered when you play ${tags
			.map(t => CardCategory[t])
			.join(' or ')} card`,
		onCardPlayed: (
			{ playerId, player, card: cardState, cardIndex },
			playedCard,
			playedCardIndex,
			playedBy
		) => {
			if (
				playerId === playedBy.id &&
				tags.find(t => playedCard.categories.includes(t))
			) {
				cardState.triggeredByCard = playedCardIndex
				pushPendingAction(player, playCardAction(cardIndex))
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
		description: f(
			`The next card you play this generation is +{0} or -{1} steps in global requirements, your choice.`,
			amount,
			amount
		),
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
			withUnits(res, -amount)
		),
		onTilePlaced: ({ game, player, card, cardIndex }, cell, placedBy) => {
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

			pushPendingAction(player, playCardAction(cardIndex))
		}
	})
})
