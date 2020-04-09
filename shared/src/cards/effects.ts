import {
	GridCellContent,
	GridCellOther,
	GridCellSpecial,
	GridCellType,
	PlayerState,
	PlayerStateValue
} from '../game'
import {
	canPlace,
	PlacementCode,
	PlacementConditionsLookup
} from '../placements'
import { withUnits } from '../units'
import { allCells, drawCard, drawCards, flatten } from '../utils'
import {
	cardArg,
	cellArg,
	effectArg,
	effectChoiceArg,
	playerCardArg
} from './args'
import {
	cardCountCondition,
	cardHasResource,
	cardResourceCondition,
	cellTypeCondition,
	condition,
	productionCondition,
	resourceCondition,
	gameCardsCondition
} from './conditions'
import { CardsLookupApi } from './lookup'
import {
	CardCategory,
	CardEffect,
	CardEffectArgumentType,
	CardEffectTarget,
	CardEffectType,
	CardResource,
	GameProgress,
	PlayerCondition,
	Resource,
	WithOptional
} from './types'
import {
	cellByCoords,
	countGridContent,
	gamePlayer,
	resourceProduction,
	resToPrice,
	updatePlayerResource,
	updatePlayerProduction
} from './utils'

export const effect = <T extends (CardEffectArgumentType | undefined)[]>(
	c: WithOptional<CardEffect<T>, 'args' | 'conditions' | 'type'>
): CardEffect<T> =>
	({
		args: [],
		conditions: [],
		type: CardEffectType.Other,
		...c
	} as CardEffect<T>)

export const resourceChange = (res: Resource, change: number) =>
	effect({
		conditions: change < 0 ? [resourceCondition(res, -change)] : [],
		description:
			change > 0
				? `+ ${withUnits(res, change)}`
				: `- ${withUnits(res, -change)}`,
		type: CardEffectType.Resource,
		perform: ({ player }) => {
			if (res !== 'money' && change < 0 && player[res] < -change) {
				throw new Error(`Player doesn't have ${-change} of ${res}!`)
			}
			player[res] += change
		}
	})

export const productionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		conditions:
			change < 0 && res !== 'money' ? [productionCondition(res, -change)] : [],
		type: CardEffectType.Production,
		description:
			change > 0
				? `+ ${change} ${res} production`
				: `- ${-change} ${res} production`,
		perform: ({ player }) => {
			player[prod] += change
		}
	})
}

export const doNothing = () =>
	effect({
		description: 'Do nothing',
		perform: () => {
			void 0
		}
	})

export const playerResourceChange = (
	res: Resource,
	change: number,
	optional = true
) => {
	return effect({
		args: [
			!optional
				? effectArg({
						descriptionPrefix:
							change > 0
								? `Give ${withUnits(res, change)} to`
								: `Remove ${withUnits(res, -change)} from`,
						type: CardEffectTarget.Player,
						optional: false,
						resource: res,
						playerConditions:
							change < 0
								? [
										resourceCondition(
											res,
											optional ? 1 : -change
										) as PlayerCondition
								  ]
								: []
				  })
				: effectArg({
						descriptionPrefix: change > 0 ? 'Give to' : `Remove from`,
						type: CardEffectTarget.PlayerResource,
						maxAmount: Math.abs(change),
						resource: res,
						optional,
						playerConditions:
							change < 0
								? [
										resourceCondition(
											res,
											optional ? 1 : -change
										) as PlayerCondition
								  ]
								: []
				  })
		],
		conditions:
			!optional && change < 0
				? [
						condition({
							description: `There has to be player with at least ${withUnits(
								res,
								-change
							)}`,
							evaluate: ({ game, playerId }) =>
								!!game.players.find(p => p.id !== playerId && p[res] >= -change)
						})
				  ]
				: [],
		description:
			change > 0
				? `Give ${optional ? ' up to' : ''} ${withUnits(
						res,
						change
				  )} to any player`
				: `Remove ${optional ? ' up to' : ''} ${withUnits(
						res,
						-change
				  )} from any player`,
		perform: ({ game }, arg: number | [number, number] = [-1, 0]) => {
			const [playerId, amount] = Array.isArray(arg) ? arg : [arg, 0]

			if (playerId === null || playerId < 0) {
				if (!optional) {
					throw new Error('You have to select a player to do this')
				} else {
					return
				}
			}

			const player = gamePlayer(game, playerId)

			const actualChange = !optional
				? change
				: change < 0
				? Math.max(change, -amount)
				: Math.min(change, amount)

			updatePlayerResource(player, res, actualChange)
		}
	})
}

export const playerProductionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		args: [
			effectArg({
				type: CardEffectTarget.Player,
				playerConditions:
					change < 0 && res !== 'money'
						? [productionCondition(res, -change) as PlayerCondition]
						: [],
				descriptionPrefix: `Decrease ${res} production of`,
				descriptionPostfix: `by ${-change} of`,
				production: prod,
				optional: false
			})
		],
		conditions:
			change < 0
				? [
						condition({
							evaluate: ({ game, playerId }) =>
								!!game.players.find(
									p => p.id !== playerId && p[prod] >= -change
								)
						})
				  ]
				: [],
		description:
			change > 0
				? `Increase ${res} production of any player by ${change}`
				: `Decrease ${res} production of any player by ${-change}`,
		perform: ({ game }, playerId: number) => {
			const player = gamePlayer(game, playerId)

			updatePlayerProduction(player, res, change)
		}
	})
}

export const gameProcessChange = (res: GameProgress, change: number) => {
	return effect({
		description:
			change > 0
				? `Increase ${res} by ${change} step`
				: `Decrease ${res} by ${-change} step`,
		perform: ({ game, player }) => {
			const update = Math.min(game.map[res] - game[res], change)

			if (update > 0) {
				game[res] += update
				player.terraformRating += update
			}
		}
	})
}

export function placeTile({
	type,
	other,
	special,
	conditions
}: {
	type: GridCellContent
	other?: GridCellOther
	special?: GridCellSpecial[]
	isolated?: boolean
	allowOcean?: boolean
	conditions?: PlacementCode[]
}) {
	const placementState = {
		type,
		other,
		special,
		conditions
	}

	return effect({
		description:
			`Place a ${other ? GridCellOther[other] : GridCellContent[type]}` +
			(conditions && conditions.length > 0
				? ` (${conditions
						?.map(c => PlacementConditionsLookup.get(c).description)
						.join(', ')})`
				: ''),
		conditions: [
			condition({
				evaluate: ({ game, playerId }) => {
					return !!allCells(game).find(c =>
						canPlace(
							game,
							game.players.find(p => p.id === playerId) as PlayerState,
							c,
							placementState
						)
					)
				}
			})
		],
		perform: ({ player, cardIndex, game }) => {
			// Only limited number of ocean tiles an be placed
			if (type === GridCellContent.Ocean && game.oceans >= game.map.oceans) {
				return
			}

			player.placingTile.push({
				...placementState,
				ownerCard: cardIndex
			})
		}
	})
}

export const convertResource = (
	srcRes: Resource,
	srcCount: number,
	dstRes: Resource,
	dstCount: number
) =>
	effect({
		conditions: [resourceCondition(srcRes, srcCount)],
		description: `Spend ${withUnits(srcRes, srcCount)} to gain ${withUnits(
			dstRes,
			dstCount
		)}`,
		perform: ({ player }) => {
			updatePlayerResource(player, srcRes, srcCount)
			updatePlayerResource(player, dstRes, dstCount)
		}
	})

export const cardsForResource = (res: Resource, count: number, cards: number) =>
	effect({
		conditions: [resourceCondition(res, count), gameCardsCondition(count)],
		description: `Spend ${withUnits(res, count)} to draw ${cards} cards`,
		perform: ({ player, game }) => {
			updatePlayerResource(player, res, -count)
			player.cards.push(...drawCards(game, cards))
		}
	})

export const terraformRatingChange = (change: number) =>
	effect({
		description:
			change >= 0
				? `+ ${change} Terraform Rating`
				: `- ${-change} Terraform Rating`,
		perform: ({ player }) => {
			player.terraformRating += change
		}
	})

export const effectChoice = (effects: CardEffect[]) =>
	effect({
		args: [effectChoiceArg(effects)],
		conditions: [
			condition({
				evaluate: (ctx, args: [number, CardEffectArgumentType[]]) => {
					const [chosenEffect, chosenArgs] = args || [undefined, []]

					if (chosenEffect === undefined) {
						return !!effects.find(e =>
							e.conditions.every(c => c.evaluate(ctx, ...chosenArgs))
						)
					}

					const effect = effects[chosenEffect]
					if (!effect) {
						throw new Error(`Unknown effect choice ${chosenEffect}`)
					}

					return effect.conditions.every(c => c.evaluate(ctx, ...chosenArgs))
				}
			})
		],
		description: effects.map(e => e.description || '').join(' OR '),
		perform: (ctx, args: [number, CardEffectArgumentType[]]) => {
			const [chosenEffect, chosenArgs] = args || [undefined, []]

			const effect = effects[chosenEffect]
			if (!effect) {
				throw new Error(`Unknown effect choice ${chosenEffect}`)
			}

			effect.perform(ctx, ...chosenArgs)
		}
	})

export const joinedEffects = (effects: CardEffect[]) =>
	effect({
		args: flatten(effects.map(e => e.args)),
		description: effects.map(e => e.description || '').join(' and '),
		conditions: flatten(effects.map(e => e.conditions)),
		perform: (ctx, ...args) => {
			console.log('playing raider effects with', args)
			effects.forEach(e => {
				e.perform(
					ctx,
					...(e.args.length > 0 ? args.splice(0, e.args.length) : [])
				)
			})
		}
	})

export const otherCardResourceChange = (res: CardResource, amount: number) =>
	effect({
		args: [
			{
				...cardArg(
					amount < 0
						? [cardResourceCondition(res, -amount)]
						: [cardHasResource(res)]
				),
				descriptionPrefix:
					amount > 0
						? `Add ${amount} ${res} to`
						: `Remove ${-amount} ${res} from`
			}
		],
		conditions: [
			condition({
				description: `Player has to have a card that accepts ${res}`,
				evaluate: ({ player }) =>
					!!player.usedCards
						.map(c => ({ card: CardsLookupApi.get(c.code), state: c }))
						.find(
							({ card, state }) =>
								card.resource === res &&
								(amount > 0 || state[card.resource] >= -amount)
						)
			})
		],
		description:
			amount < 0
				? `Remove ${-amount} ${res} from any other card`
				: `Add ${amount} ${res} to any other card`,
		perform: ({ player }, cardIndex: number) => {
			const cardState = player.usedCards[cardIndex]
			if (!cardState) {
				throw new Error(`Invalid card target ${cardIndex}`)
			}

			const card = CardsLookupApi.get(cardState?.code)

			if (card.resource !== res) {
				throw new Error(`${card.title} doesn't accept ${res}`)
			}

			// TODO: Check if player can place it on this card
			cardState[res] += amount
		}
	})

export const cardResourceChange = (res: CardResource, amount: number) =>
	effect({
		description:
			amount >= 0
				? `Add ${amount} of ${res} units to this card`
				: `Remove ${amount} of ${res} units from this card`,
		conditions: amount < 0 ? [cardResourceCondition(res, -amount)] : [],
		perform: ({ card }) => {
			card[res] += amount
		}
	})

export const playerCardResourceChange = (res: CardResource, amount: number) =>
	effect({
		args: [
			{
				...playerCardArg(
					amount < 0 ? [cardResourceCondition(res, -amount)] : [],
					-amount
				),
				descriptionPrefix:
					amount > 0
						? `add ${amount} ${res} to `
						: `remove ${-amount} ${res} from`
			}
		],
		conditions:
			amount < 0
				? [
						condition({
							evaluate: ({ game }) =>
								!!game.players.find(
									p => !!p.usedCards.find(c => c[res] >= -amount)
								)
						})
				  ]
				: [],
		description:
			amount < 0
				? `Remove ${-amount} ${res} from any other player card`
				: `Add ${amount} ${res} to any other player card`,
		perform: ({ game }, [playerId, cardIndex]: [number, number]) => {
			const player = game.players.find(p => p.id === playerId)
			if (!player) {
				throw new Error(`Invalid player id ${playerId}`)
			}
			const cardState = player.usedCards[cardIndex]

			if (!cardState) {
				throw new Error(`Invalid card target ${cardIndex}`)
			}

			const card = CardsLookupApi.get(cardState?.code)

			if (card.resource !== res) {
				throw new Error(`${card.title} doesn't accept ${res}`)
			}

			cardState[res] += amount
		}
	})

export const productionChangeForTags = (
	res: Resource,
	change: number,
	tag: CardCategory
) => {
	return effect({
		description: `Increase your ${res} production by ${change} for each ${CardCategory[tag]} card you have`,
		perform: ({ player }) => {
			updatePlayerProduction(
				player,
				res,
				change *
					player.usedCards.reduce(
						(acc, c) =>
							acc +
							CardsLookupApi.get(c.code).categories.filter(c => c === tag)
								.length,
						0
					)
			)
		}
	})
}

export const convertTopCardToCardResource = (
	category: CardCategory,
	res: CardResource,
	amount: number
) =>
	effect({
		conditions: [resourceCondition('money', 1), gameCardsCondition(1)],
		description: `Spend 1 $ to reveal top card of the draw deck. If the card has ${CardCategory[category]} tag, add ${amount} ${res} resource here`,
		perform: ({ player, game, card }) => {
			const drawnCard = drawCard(game)
			const drawn = CardsLookupApi.get(drawnCard)

			player.money -= 1

			if (drawn.categories.includes(category)) {
				card[res] += amount
			}

			game.discarded.push(drawnCard)
		}
	})

export const pickTopCards = (count: number, pickCount?: number, free = false) =>
	effect({
		description: `Look at top ${count} cards and either buy them or discard them`,
		conditions: [gameCardsCondition(count)],
		perform: ({ player, game }) => {
			player.cardsPick = drawCards(game, count)
			player.cardsPickFree = free
			player.cardsPickLimit = pickCount || 0
			player.state = PlayerStateValue.PickingCards
		}
	})

export const getTopCards = (count: number) =>
	effect({
		description: `Draw ${count} card(s)`,
		conditions: [gameCardsCondition(count)],
		perform: ({ player, game }) => {
			player.cards.push(...drawCards(game, count))
		}
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
			)
		],
		description: `Spend ${withUnits(costRes, cost)} to gain ${
			resPerCity > 1
				? `${withUnits(res, resPerCity)} for each city on Mars`
				: `${withUnits(res, 1)} per ${Math.ceil(1 / resPerCity)} cities on Mars`
		}`,
		perform: ({ player, game }) => {
			updatePlayerResource(
				player,
				res,
				Math.floor(countGridContent(game, GridCellContent.City) * resPerCity)
			)
		}
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
			updatePlayerResource(
				player,
				res,
				Math.floor(countGridContent(game, tile) * resPerTile)
			)
		}
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
			updatePlayerProduction(
				player,
				res,
				Math.floor(countGridContent(game, tile) * resPerTile)
			)
		}
	})

export const moneyOrResForOcean = (res: 'ore' | 'titan', cost: number) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: res,
				descriptionPrefix: `Use`,
				descriptionPostfix: `of ${res} to pay`
			})
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					player.money + player[res] * player[resToPrice[res]] >= cost
			})
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

			updatePlayerResource(ctx.player, res, -usedRes)
			updatePlayerResource(
				ctx.player,
				'money',
				-Math.max(0, cost - usedRes * ctx.player[resToPrice[res]])
			)
		}
	})

export const cardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.cardPriceChange += change
		}
	})

export const spaceCardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a Space card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.spacePriceChange += change
		}
	})

export const earthCardPriceChange = (change: number) =>
	effect({
		description: `Effect: When you play a Earth card, you pay ${withUnits(
			'money',
			-change
		)} less for it`,
		perform: ({ player }) => {
			player.earthPriceChange += change
		}
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
		description: `+ ${amount} if you have ${tagCount} ${CardCategory[tag]} cards`
	})

export const claimCell = () =>
	effect({
		args: [
			cellArg(
				[
					{
						evaluate: ({ cell }) =>
							!cell.content && cell.type === GridCellType.General
					}
				],
				'Cell to claim'
			)
		],
		description:
			'Place your marker on any area. Only you will be able to place tiles on this area.',
		perform: ({ playerId, game }, [x, y]: [number, number]) => {
			const cell = cellByCoords(game, x, y)
			cell.claimantId = playerId
		}
	})

export const orePriceChange = (change: number) =>
	effect({
		description: `Effect: Ore is worth ${withUnits('money', change)} extra`,
		perform: ({ player }) => {
			player.orePrice += change
		}
	})

export const titanPriceChange = (change: number) =>
	effect({
		description: `Effect: Titan is worth ${withUnits('money', change)} extra`,
		perform: ({ player }) => {
			player.titanPrice += change
		}
	})

export const cardExchange = () =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Card,
				cardConditions: [],
				descriptionPrefix: 'Discard',
				fromHand: true
			})
		],
		description: `Discard a card from hand to draw a new card`,
		conditions: [gameCardsCondition(1)],
		perform: ({ player, game }, cardIndex: number) => {
			if (cardIndex < 0 || cardIndex >= player.cards.length) {
				throw new Error(`Invalid card index ${cardIndex}`)
			}

			game.discarded.push(player.cards[cardIndex])
			player.cards.splice(cardIndex, 1)
			player.cards.push(drawCard(game))
		}
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
				}
			})
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
		}
	})

export const duplicateProduction = (type: CardCategory) =>
	effect({
		description: `Duplicate only the production effect of one of your ${CardCategory[type]} cards`,
		args: [
			cardArg(
				[
					{
						evaluate: ctx => {
							const data = CardsLookupApi.get(ctx.card.code)
							return (
								data.categories.includes(type) &&
								!!data.playEffects.find(
									e => e.type === CardEffectType.Production
								) &&
								!!data.playEffects
									.filter(e => e.type === CardEffectType.Production)
									.every(e => e.conditions.every(c => c.evaluate(ctx)))
							)
						}
					}
				],
				'Duplicate production of'
			)
		],
		conditions: [
			{
				evaluate: ctx =>
					!!ctx.player.usedCards.find((card, cardIndex) => {
						const data = CardsLookupApi.get(card.code)
						return (
							data.categories.includes(type) &&
							!!data.playEffects.find(
								e => e.type === CardEffectType.Production
							) &&
							!!data.playEffects
								.filter(e => e.type === CardEffectType.Production)
								.every(e =>
									e.conditions.every(c =>
										c.evaluate({
											game: ctx.game,
											player: ctx.player,
											playerId: ctx.playerId,
											card,
											cardIndex
										})
									)
								)
						)
					})
			}
		],
		perform: (ctx, cardIndex: number) => {
			const { player } = ctx
			const card = player.usedCards[cardIndex]

			if (!card) {
				throw new Error(`Invalid card index ${cardIndex}`)
			}

			const cardData = CardsLookupApi.get(card.code)

			cardData.playEffects.forEach(e => {
				if (e.type === CardEffectType.Production) {
					e.perform({ ...ctx, card, cardIndex })
				}
			})
		}
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
			updatePlayerProduction(
				player,
				res,
				game.players.reduce((acc, p) => {
					if (self || p.id !== playerId) {
						return (
							acc +
							p.usedCards
								.map(c => CardsLookupApi.get(c.code))
								.reduce(
									(acc, c) =>
										acc + c.categories.filter(cat => cat === tag).length,
									0
								)
						)
					}
					return acc
				}, 0)
			)
		}
	})
}

export const terraformRatingForTags = (tag: CardCategory, amount: number) =>
	effect({
		description: `Raise your terraform rating by ${amount} per every ${CardCategory[tag]} card you played`,
		type: CardEffectType.Production,
		perform: ({ player }) => {
			player.terraformRating += player.usedCards
				.map(c => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) => acc + c.categories.filter(cat => cat === tag).length,
					0
				)
		}
	})

export const productionForTags = (
	tag: CardCategory,
	res: Resource,
	resPerCard: number
) => {
	return effect({
		description:
			resPerCard >= 1
				? `Increase your ${res} production by ${resPerCard} per every ${CardCategory[tag]} card you played (including this if applicable)`
				: `Increase your ${res} production by 1 per every ${Math.round(
						1 / resPerCard
				  )} ${
						CardCategory[tag]
				  } card(s) you played (including this if applicable)`,
		type: CardEffectType.Production,
		perform: ({ player, card }) => {
			updatePlayerProduction(
				player,
				res,
				Math.floor(
					player.usedCards
						.map(c => CardsLookupApi.get(c.code))
						.reduce(
							(acc, c) => acc + c.categories.filter(cat => cat === tag).length,
							CardsLookupApi.get(card.code).categories.filter(
								cat => cat === tag
							).length
						) * resPerCard
				)
			)
		}
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
			updatePlayerResource(
				player,
				res,
				game.players.reduce((acc, p) => {
					if (self || p.id !== playerId) {
						return (
							acc +
							p.usedCards
								.map(c => CardsLookupApi.get(c.code))
								.reduce(
									(acc, c) =>
										acc + c.categories.filter(cat => cat === tag).length,
									0
								)
						)
					}
					return acc
				}, 0)
			)
		}
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
			updatePlayerResource(
				player,
				res,
				player.usedCards
					.map(c => CardsLookupApi.get(c.code))
					.reduce(
						(acc, c) => acc + c.categories.filter(cat => cat === tag).length,
						0
					)
			)
		}
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
					}
				}
			])
		],
		conditions: [
			condition({
				evaluate: ({ player }) =>
					!!player.usedCards.find(
						c => c[CardsLookupApi.get(c.code).resource || 'animals'] > 0
					)
			})
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
		}
	})

export const exchangeResources = (srcRes: Resource, dstRes: Resource) =>
	effect({
		args: [
			effectArg({
				type: CardEffectTarget.Resource,
				resource: srcRes,
				descriptionPrefix: 'Exchange',
				descriptionPostfix: `for ${dstRes}`
			})
		],
		description: `Exchange ${withUnits(srcRes, 'X')} for ${withUnits(
			dstRes,
			'X'
		)}`,
		conditions: [resourceCondition(srcRes, 1)],
		perform: ({ player }, amount: number) => {
			if (player[srcRes] < amount) {
				throw new Error(`You don't have ${amount} of ${srcRes}`)
			}

			updatePlayerResource(player, srcRes, -amount)
			updatePlayerResource(player, dstRes, amount)
		}
	})
