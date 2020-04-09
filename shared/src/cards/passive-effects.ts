import { GridCellContent, GridCellOther, StandardProjectType } from '../game'
import { withUnits } from '../units'
import {
	CardCategory,
	CardPassiveEffect,
	CardResource,
	Resource
} from './types'
import { resourceProduction, updatePlayerResource } from './utils'
import { CardsLookupApi } from './lookup'
import { f } from '../utils'

export const passiveEffect = (e: CardPassiveEffect) => e

export const resourcePerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When anyone places an ${
			GridCellContent[content]
		} tile, gain ${withUnits(res, amount)}`,
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
		description: `When you play place a ${GridCellContent[tile]} tile, place ${amount} of ${res} on this card`,
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
			if (card.played) {
				return
			}

			if (cell.other === type) {
				const res = cell.titan > 0 ? 'titan' : 'ore'
				player[resourceProduction[res]] += amount
				card.played = true
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
				player.cardsToPlay.push(cardIndex)
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
				player.cardsToPlay.push(cardIndex)
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
