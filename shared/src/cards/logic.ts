import {
	CardResource,
	CardCategory,
	CardEffectTarget,
	Resource,
	CardEffectType,
} from './types'
import {
	effect,
	resourceCondition,
	effectArg,
	cellTypeCondition,
	countGridContent,
	condition,
	placeTile,
	drawnCards,
	passiveEffect,
	productionChange,
	cardCountCondition,
	resourceProduction,
	cellArg,
	cellByCoords,
	cardArg,
} from './utils'
import { CardsLookupApi } from './lookup'
import {
	PlayerStateValue,
	GridCellContent,
	GridCellOther,
	GridCellType,
} from '../game'
import { withUnits } from '../units'

export const convertTopCardToCardResource = (
	category: CardCategory,
	res: CardResource,
	amount: number
) =>
	effect({
		args: [drawnCards(1)],
		conditions: [resourceCondition('money', 1)],
		description: `Spend 1 $ to reveal top card of the draw deck. If the card has ${CardCategory[category]} tag, add ${amount} ${res} resource here`,
		perform: ({ player, card }, drawnCards: string[]) => {
			const drawn = CardsLookupApi.get(drawnCards[0])

			player.money -= 1

			if (drawn.categories.includes(category)) {
				card[res] += amount
			}
		},
	})

export const pickTopCards = (count: number, pickCount?: number, free = false) =>
	effect({
		args: [drawnCards(count)],
		description: `Look at top ${count} cards and either buy them or discard them`,
		perform: ({ player }, drawnCards: string[]) => {
			player.cardsPick = drawnCards
			player.cardsPickFree = free
			player.cardsPickLimit = pickCount || 0
			player.state = PlayerStateValue.PickingCards
		},
	})

export const getTopCards = (count: number) =>
	effect({
		args: [drawnCards(count)],
		description: `Draw ${count} card(s)`,
		perform: ({ player }, drawnCards: string[]) => {
			player.cards.push(...drawnCards)
		},
	})

export const resourceForCities = (
	costRes: Resource,
	cost: number,
	res: Resource,
	resPerCity: number
) =>
	effect({
		conditions: [
			resourceCondition(costRes, cost),
			cellTypeCondition(
				GridCellContent.City,
				resPerCity > 1 ? 1 : Math.ceil(1 / resPerCity)
			),
		],
		description: `Spend ${withUnits(costRes, cost)} to gain ${
			resPerCity > 1
				? `${withUnits(res, resPerCity)} for each city on Mars`
				: `${withUnits(res, 1)} per ${Math.ceil(1 / resPerCity)} cities on Mars`
		}`,
		perform: ({ player, game }) => {
			player[res] += Math.floor(
				countGridContent(game, GridCellContent.City) * resPerCity
			)
		},
	})

export const resourcesForTiles = (
	tile: GridCellContent,
	res: Resource,
	resPerTile: number
) =>
	effect({
		description: `Gain ${
			resPerTile > 1
				? `${withUnits(res, resPerTile)} for each ${
						GridCellContent[tile]
				  } on Mars`
				: `${withUnits(res, 1)} per ${Math.ceil(1 / resPerTile)} ${
						GridCellContent[tile]
				  } on Mars`
		}`,
		perform: ({ player, game }) => {
			player[res] += Math.floor(countGridContent(game, tile) * resPerTile)
		},
	})

export const productionForTiles = (
	tile: GridCellContent,
	res: Resource,
	resPerTile: number
) =>
	effect({
		description: `Increase production of ${res} by ${
			resPerTile > 1
				? `${resPerTile} for each ${GridCellContent[tile]} on Mars`
				: `${resPerTile} per ${Math.ceil(1 / resPerTile)} ${
						GridCellContent[tile]
				  } on Mars`
		}`,
		type: CardEffectType.Production,
		perform: ({ player, game }) => {
			player[resourceProduction[res]] += Math.floor(
				countGridContent(game, tile) * resPerTile
			)
		},
	})

const resToPrice = {
	ore: 'orePrice',
	titan: 'titanPrice',
} as const

export const moneyOrResForOcean = (res: 'ore' | 'titan', cost: number) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: res,
				descriptionPrefix: `Use`,
				descriptionPostfix: `of ${res} to pay`,
			}),
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					player.money + player[res] * player[resToPrice[res]] >= cost,
			}),
		],
		description: `Pay ${withUnits(
			'money',
			cost
		)} to place an ocean tile, ${res} can also be used`,
		perform: (ctx, value: number) => {
			if (value > ctx.player[res]) {
				throw new Error(`You don't have that much ${res}`)
			}

			const usedRes = Math.min(
				Math.ceil(cost / ctx.player[resToPrice[res]]),
				value
			)

			placeTile({ type: GridCellContent.Ocean }).perform(ctx)

			ctx.player[res] -= usedRes
			ctx.player.money -= Math.max(
				0,
				cost - usedRes * ctx.player[resToPrice[res]]
			)
		},
	})

export const cardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.cardPriceChange += change
		},
	})

export const spaceCardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a Space card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.spacePriceChange += change
		},
	})

export const earthCardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a Earth card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.earthPriceChange += change
		},
	})

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
			if (cell.content === GridCellContent.Ocean) {
				player[res] += amount
			}
		},
	})

export const productionPerPlacedTile = (
	content: GridCellContent,
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When anyone places an ${GridCellContent[content]} tile, increase ${res} production by ${amount}`,
		onTilePlaced: ({ player }, cell) => {
			if (cell.content === GridCellContent.Ocean) {
				player[resourceProduction[res]] += amount
			}
		},
	})

export const resourcePerCardPlayed = (
	categories: CardCategory[],
	res: Resource,
	amount: number
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map((c) => CardCategory[c])
			.join(' ')} card, you gain ${withUnits(res, amount)}`,
		onCardPlayed: ({ player, playerId }, card, _cardIndex, playedBy) => {
			if (
				playedBy.id === playerId &&
				categories.every((c) => card.categories.includes(c))
			) {
				player[res] += amount
			}
		},
	})

export const cardResourcePerCardPlayed = (
	categories: CardCategory[],
	res: CardResource,
	amount: number
) =>
	passiveEffect({
		description: `When you play a ${categories
			.map((c) => CardCategory[c])
			.join(' or ')} card, place ${amount} ${res} on this card`,
		onCardPlayed: (
			{ playerId, card: cardState },
			card,
			_cardIndex,
			playedBy
		) => {
			if (
				playedBy.id === playerId &&
				categories.find((c) => card.categories.includes(c))
			) {
				cardState[res] += amount
			}
		},
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
		},
	})

export const resourceChangeIfTags = (
	res: Resource,
	amount: number,
	tag: CardCategory,
	tagCount: number
) =>
	effect({
		...productionChange(res, amount),
		conditions: [cardCountCondition(tag, tagCount)],
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
		},
	})

export const claimCell = () =>
	effect({
		args: [
			cellArg(
				[
					{
						evaluate: ({ cell }) =>
							!cell.content && cell.type === GridCellType.General,
					},
				],
				'Cell to claim'
			),
		],
		description:
			'Place your marker on any area. Only you will be able to place tiles on this area.',
		perform: ({ playerId, game }, [x, y]: [number, number]) => {
			const cell = cellByCoords(game, x, y)
			cell.claimantId = playerId
		},
	})

export const orePriceChange = (change: number) =>
	effect({
		description: `Effect: Ore is worth ${withUnits('money', change)} extra`,
		perform: ({ player }) => {
			player.orePrice += change
		},
	})

export const titanPriceChange = (change: number) =>
	effect({
		description: `Effect: Titan is worth ${withUnits('money', change)} extra`,
		perform: ({ player }) => {
			player.titanPrice += change
		},
	})

export const cardExchange = () =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Card,
				cardConditions: [],
				descriptionPrefix: 'Discard',
				optional: true,
				fromHand: true,
			}),
			drawnCards(1),
		],
		description: `Discard a card from hand to draw a new card`,
		perform: ({ player }, cardIndex: number, [cardCode]: [string]) => {
			player.cards.splice(cardIndex, 1)
			player.cards.push(cardCode)
		},
	})

export const cardExchangeEffect = (tag: CardCategory) =>
	passiveEffect({
		description: `Effect: Action is triggered when you play a ${CardCategory[tag]} card`,
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
		},
	})

export const playWhenCard = (tags: CardCategory[]) =>
	passiveEffect({
		description: `Action triggered when you play ${tags
			.map((t) => CardCategory[t])
			.join(' or ')} card`,
		onCardPlayed: (
			{ playerId, player, card: cardState, cardIndex },
			playedCard,
			playedCardIndex,
			playedBy
		) => {
			if (
				playerId === playedBy.id &&
				tags.find((t) => playedCard.categories.includes(t))
			) {
				cardState.triggeredByCard = playedCardIndex
				player.cardsToPlay.push(cardIndex)
			}
		},
	})

export const triggerCardResourceChange = (amount: number) =>
	effect({
		description: `Add ${amount} resource(s) to the played card`,
		conditions: [
			condition({
				evaluate: ({ card, player }) => {
					const target = player.usedCards[card.triggeredByCard as number]
					if (!target) {
						return false
					}

					const targetResource = CardsLookupApi.get(target.code).resource
					if (!targetResource) {
						return false
					}

					return true
				},
			}),
		],
		perform: ({ card, player }) => {
			const target = player.usedCards[card.triggeredByCard as number]
			if (!target) {
				throw new Error(`Can't add 1 resource to played card!`)
			}

			const targetResource = CardsLookupApi.get(target.code).resource
			if (!targetResource) {
				throw new Error('Target card is resource-less')
			}

			target[targetResource] += amount
		},
	})

export const duplicateProduction = (type: CardCategory) =>
	effect({
		description: `Duplicate only the production effect of one of your ${CardCategory[type]} cards`,
		args: [
			cardArg(
				[
					{
						evaluate: (ctx) => {
							const data = CardsLookupApi.get(ctx.card.code)
							return (
								data.categories.includes(type) &&
								!!data.playEffects.find(
									(e) => e.type === CardEffectType.Production
								) &&
								!!data.playEffects
									.filter((e) => e.type === CardEffectType.Production)
									.every((e) => e.conditions.every((c) => c.evaluate(ctx)))
							)
						},
					},
				],
				'Duplicate production of'
			),
		],
		perform: (ctx, cardIndex: number) => {
			const { player } = ctx
			const card = player.usedCards[cardIndex]

			if (!card) {
				throw new Error(`Invalid card index ${cardIndex}`)
			}

			const cardData = CardsLookupApi.get(card.code)

			cardData.playEffects.forEach((e) => {
				if (e.type === CardEffectType.Production) {
					e.perform({ ...ctx, card, cardIndex })
				}
			})
		},
	})

export const productionForPlayersTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number,
	self = false
) => {
	return effect({
		description: `Increase your ${res} production by ${resPerCard} per every ${
			CardCategory[tag]
		} card${self ? '' : ' your OPPONENTS'} played`,
		type: CardEffectType.Production,
		perform: ({ game, player, playerId }) => {
			player[resourceProduction[res]] += game.players.reduce((acc, p) => {
				if (self || p.id !== playerId) {
					return (
						acc +
						p.gameState.usedCards
							.map((c) => CardsLookupApi.get(c.code))
							.reduce(
								(acc, c) =>
									acc + c.categories.filter((cat) => cat === tag).length,
								0
							)
					)
				}
				return acc
			}, 0)
		},
	})
}

export const terraformRatingForTags = (tag: CardCategory, amount: number) =>
	effect({
		description: `Raise your terraform rating by ${amount} per every ${CardCategory[tag]} card you played`,
		type: CardEffectType.Production,
		perform: ({ player }) => {
			player.terraformRating += player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) => acc + c.categories.filter((cat) => cat === tag).length,
					0
				)
		},
	})

export const productionForTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number
) => {
	return effect({
		description:
			resPerCard >= 1
				? `Increase your ${res} production by ${resPerCard} per every ${CardCategory[tag]} card you played`
				: `Increase your ${res} production by 1 per every ${Math.round(
						1 / resPerCard
				  )} ${CardCategory[tag]} card(s) you played`,
		type: CardEffectType.Production,
		perform: ({ player }) => {
			player[resourceProduction[res]] += Math.floor(
				player.usedCards
					.map((c) => CardsLookupApi.get(c.code))
					.reduce(
						(acc, c) => acc + c.categories.filter((cat) => cat === tag).length,
						0
					) * resPerCard
			)
		},
	})
}

export const resourcesForPlayersTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number,
	self = false
) => {
	return effect({
		description: `Gain ${withUnits(res, resPerCard)} per every ${
			CardCategory[tag]
		} card${self ? '' : ' your OPPONENTS'} played`,
		type: CardEffectType.Production,
		perform: ({ game, player, playerId }) => {
			player[res] += game.players.reduce((acc, p) => {
				if (self || p.id !== playerId) {
					return (
						acc +
						p.gameState.usedCards
							.map((c) => CardsLookupApi.get(c.code))
							.reduce(
								(acc, c) =>
									acc + c.categories.filter((cat) => cat === tag).length,
								0
							)
					)
				}
				return acc
			}, 0)
		},
	})
}

export const resourcesForTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number
) => {
	return effect({
		description: `Gain ${withUnits(res, resPerCard)} per every ${
			CardCategory[tag]
		} card you played`,
		type: CardEffectType.Production,
		perform: ({ player }) => {
			player[res] += player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) => acc + c.categories.filter((cat) => cat === tag).length,
					0
				)
		},
	})
}

export const addResourceToCard = () =>
	effect({
		description: 'Add 1 resource to a card with at least 1 resource on it',
		args: [
			cardArg([
				{
					evaluate: ({ card }) => {
						const res = CardsLookupApi.get(card.code)?.resource
						return !!res && card[res] >= 1
					},
				},
			]),
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					!!player.usedCards.find(
						(c) => c[CardsLookupApi.get(c.code).resource || 'animals'] > 0
					),
			}),
		],
		perform: ({ player }, cardIndex: number) => {
			const card = player.usedCards[cardIndex]
			if (!card) {
				throw new Error(`Unknown card index ${cardIndex}`)
			}
			const res = CardsLookupApi.get(card.code).resource

			if (!res) {
				throw new Error("Card doesn't have resource")
			}

			player.usedCards[cardIndex][res] += 1
		},
	})

export const exchangeResources = (srcRes: Resource, dstRes: Resource) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: srcRes,
				descriptionPrefix: 'Exchange',
				descriptionPostfix: `for ${dstRes}`,
			}),
		],
		description: `Exchange ${withUnits(srcRes, 'X')} for ${withUnits(
			dstRes,
			'X'
		)}`,
		perform: ({ player }, amount: number) => {
			if (player[srcRes] < amount) {
				throw new Error(`You don't have ${amount} of ${srcRes}`)
			}

			player[srcRes] -= amount
			player[dstRes] += amount
		},
	})
