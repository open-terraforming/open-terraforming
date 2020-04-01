import {
	WithOptional,
	CardEffect,
	CardCondition,
	Resource,
	Card,
	CardEffectArgument,
	CardEffectTarget,
	GameProgress,
	CardCategory,
	CardVictoryPointsCallback,
	CardResource,
	CardEffectArgumentType,
	PlayerCondition,
	CardPassiveEffect,
	CellCondition,
	CardEffectType,
	CardCallbackContext,
} from './types'
import {
	GameState,
	GridCellContent,
	GridCellOther,
	PlayerStateValue,
	GridCell,
	GridCellSpecial,
	PlayerState,
} from '../game'
import { CardsLookupApi } from './lookup'
import { withUnits, progressResToStr } from '../units'
import {
	PlacementCode,
	PlacementConditionsLookup,
	canPlace,
} from '../placements'
import { allCells, adjacentCells } from '../utils'

export const vpCb = (cb: CardVictoryPointsCallback) => cb

const flatten = <T>(a: T[][]) => a.reduce((acc, a) => [...acc, ...a], [] as T[])

export const resourceProduction = {
	money: 'moneyProduction',
	ore: 'oreProduction',
	titan: 'titanProduction',
	plants: 'plantsProduction',
	energy: 'energyProduction',
	heat: 'heatProduction',
} as const

const gamePlayer = (game: GameState, playerId: number) => {
	const p = game.players.find((p) => p.id === playerId)
	if (!p) {
		throw new Error(`Failed to find player #${playerId}`)
	}
	return p.gameState
}

export const cellByCoords = (game: GameState, x: number, y: number) => {
	const spec = game.map.special.find((s) => s.x === x && s.y === y)
	if (spec) {
		return spec
	}

	let cell: GridCell | undefined

	if (x >= 0 && x < game.map.width) {
		cell = game.map.grid[x][y]
	}

	if (!cell) {
		throw new Error(`No cell at ${x},${y}`)
	}

	return cell
}

export const countGridContent = (
	game: GameState,
	content: GridCellContent,
	playerId?: number
) => {
	return game.map.grid.reduce(
		(acc, c) =>
			acc +
			c.filter(
				(c) =>
					c.content === content &&
					(playerId === undefined || c.ownerId === playerId)
			).length,
		0
	)
}

export const passiveEffect = (e: CardPassiveEffect) => e

export const effect = <T extends CardEffectArgumentType[]>(
	c: WithOptional<CardEffect<T>, 'args' | 'conditions' | 'type'>
): CardEffect<T> =>
	({
		args: [],
		conditions: [],
		type: CardEffectType.Other,
		...c,
	} as CardEffect<T>)

export const effectArg = (
	c: WithOptional<
		CardEffectArgument,
		'playerConditions' | 'cardConditions' | 'optional' | 'cellConditions'
	>
) =>
	({
		playerConditions: [],
		cardConditions: [],
		cellConditions: [],
		optional: true,
		...c,
	} as CardEffectArgument)

export const condition = <T extends CardEffectArgumentType[]>(
	c: CardCondition<T>
): CardCondition<T> => c

export const drawnCards = (amount = 1) =>
	effectArg({
		type: CardEffectTarget.DrawnCards,
		drawnCards: amount,
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
		description: `${progressResToStr(res)} has to be at least ${value}`,
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game }) => game[res] <= value,
		description: `${progressResToStr(res)} has to be at most ${value}`,
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

export const resourceChange = (res: Resource, change: number) =>
	effect({
		conditions: change < 0 ? [resourceCondition(res, -change)] : [],
		description:
			change > 0
				? `You'll receive ${withUnits(res, change)}`
				: `You'll loose ${withUnits(res, -change)}`,
		type: CardEffectType.Resource,
		perform: ({ player }) => {
			player[res] += change
		},
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]
	return condition({
		evaluate: ({ player }) => player[prod] >= value,
		description: `Your ${res} production has to be at least ${value}`,
	})
}

export const productionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		conditions:
			change < 0 && res !== 'money' ? [productionCondition(res, -change)] : [],
		type: CardEffectType.Production,
		description:
			change > 0
				? `Your ${res} production will increase by ${change}`
				: `Your ${res} production will decrease by ${-change}`,
		perform: ({ player }) => {
			player[prod] += change
		},
	})
}

export const playerResourceChange = (
	res: Resource,
	change: number,
	optional = true
) => {
	return effect({
		args: [
			effectArg({
				description: `From player`,
				type: CardEffectTarget.Player,
				playerConditions:
					change < 0
						? [
								resourceCondition(
									res,
									optional ? 1 : -change
								) as PlayerCondition,
						  ]
						: [],
			}),
			...(optional
				? [
						effectArg({
							description: `remove`,
							type: CardEffectTarget.Resource,
							maxAmount: Math.abs(change),
							resource: res,
							optional,
						}),
				  ]
				: []),
		],
		description:
			change > 0
				? `Give up to ${withUnits(res, change)} to any player`
				: `Remove up to ${withUnits(res, -change)} from any player`,
		perform: ({ game }, playerId: number, amount: number) => {
			const actualChange = optional
				? change
				: change < 0
				? Math.max(change, -amount)
				: Math.min(change, amount)

			playerId >= 0 && (gamePlayer(game, playerId)[res] += actualChange)
		},
	})
}

export const playerProductionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		args: [
			effectArg({
				type: CardEffectTarget.Player,
				playerConditions:
					change < 0
						? [productionCondition(res, -change) as PlayerCondition]
						: [],
				description: `Decrease ${res} production by ${-change} of`,
			}),
		],
		conditions: [
			condition({
				evaluate: ({ game, playerId }) =>
					!!game.players.find(
						(p) => p.id !== playerId && p.gameState[prod] >= -change
					),
			}),
		],
		description:
			change > 0
				? `Increase ${res} production of any player by ${change}`
				: `Decrease ${res} production of any player by ${-change}`,
		perform: ({ game }, playerId: number) => {
			const player = gamePlayer(game, playerId)

			player[prod] += change
		},
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
		},
	})
}

export const minCardResourceToVP = (
	res: CardResource,
	amount: number,
	vps: number
) =>
	vpCb({
		description: `${vps} VPs if you have at least ${amount} of ${res} resources here`,
		compute: ({ card }) => {
			return card[res] >= amount ? vps : 0
		},
	})

// TODO: Check of ocean counts
// TODO: Check for conditions
export function placeTile({
	type,
	other,
	special,
	conditions,
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
		conditions,
	}

	return effect({
		description:
			`Place a ${other ? GridCellOther[other] : GridCellContent[type]} tile` +
			(conditions && conditions.length > 0
				? ` (${conditions
						?.map((c) => PlacementConditionsLookup.get(c).description)
						.join(', ')})`
				: ''),
		conditions: [
			condition({
				evaluate: ({ game, playerId }) => {
					return !!allCells(game).find((c) =>
						canPlace(
							game,
							game.players.find((p) => p.id === playerId) as PlayerState,
							c,
							placementState
						)
					)
				},
			}),
		],
		perform: ({ player, cardIndex, game }) => {
			// Only limited number of ocean tiles an be placed
			if (type === GridCellContent.Ocean && game.oceans >= game.map.oceans) {
				return
			}

			player.placingTile.push({
				...placementState,
				ownerCard: cardIndex,
			})
			player.state = PlayerStateValue.PlacingTile
		},
	})
}

export const vpsForAdjacentTiles = (type: GridCellContent, perTile: number) =>
	vpCb({
		description: `${perTile} VPs for each adjacent ${GridCellContent[type]} tile`,
		compute: ({ playerId, game, card, cardIndex }) => {
			const tile = allCells(game).find(
				(c) => c.ownerId === playerId && c.ownerCard === cardIndex
			)
			if (!tile) {
				throw new Error(`No tile placed for card ${card.code} (${cardIndex})`)
			}

			return (
				adjacentCells(game, tile.x, tile.y).filter((c) => c.content === type)
					.length * perTile
			)
		},
	})

export const vpsForCards = (category: CardCategory, vpPerCategory: number) =>
	vpCb({
		description: `${vpPerCategory} VP for each ${CardCategory[category]} tag you have`,
		compute: ({ player }) => {
			return player.usedCards
				.map((c) => CardsLookupApi.get(c.code))
				.reduce(
					(acc, c) =>
						acc + c.categories.filter((cat) => cat === category).length,
					0
				)
		},
	})

export const vpsForCardResources = (res: CardResource, vpPerUnit: number) =>
	vpCb({
		description: `${vpPerUnit >= 1 ? vpPerUnit : 1} VP per ${
			vpPerUnit >= 1 ? 1 : Math.ceil(1 / vpPerUnit)
		} ${res} on this card`,
		compute: ({ card }) => {
			return Math.floor(card[res] * vpPerUnit)
		},
	})

export const vpsForTiles = (type: GridCellContent, perTile: number) =>
	vpCb({
		description: `${perTile} VPs for each ${GridCellContent[type]} tile in game`,
		compute: ({ game }) => {
			return countGridContent(game, type) * perTile
		},
	})

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
			player[srcRes] -= srcCount
			player[dstRes] += dstCount
		},
	})

export const cardsForResource = (res: Resource, count: number, cards: number) =>
	effect({
		args: [drawnCards(1)],
		conditions: [resourceCondition(res, count)],
		description: `Spend ${withUnits(res, count)} to draw ${cards} cards`,
		perform: ({ player }, drawnCards: string[]) => {
			player[res] -= count
			player.cards.push(...drawnCards)
		},
	})

export const terraformRatingChange = (change: number) =>
	effect({
		description:
			change >= 0
				? `Increase your Terraform rating by ${change} step(s)`
				: `Decrease your Terraform rating by ${-change} step(s)`,
		perform: ({ player }) => {
			player.terraformRating += change
		},
	})

export const effectChoiceArg = (effects: CardEffect[]) =>
	effectArg({
		type: CardEffectTarget.EffectChoice,
		effects,
	})

export const effectChoice = (effects: CardEffect[]) =>
	effect({
		args: [effectChoiceArg(effects)],
		conditions: [
			condition({
				evaluate: (
					ctx,
					chosenEffect: number,
					chosenArgs: CardEffectArgumentType[]
				) => {
					if (chosenEffect === undefined) {
						return !!effects.find((e) =>
							e.conditions.every((c) => c.evaluate(ctx, ...chosenArgs))
						)
					}

					const effect = effects[chosenEffect]
					if (!effect) {
						throw new Error(`Unknown effect choice ${chosenEffect}`)
					}

					return effect.conditions.every((c) => c.evaluate(ctx, ...chosenArgs))
				},
			}),
		],
		description: effects.map((e) => e.description || '').join(' OR '),
		perform: (
			ctx,
			chosenEffect: number,
			chosenArgs: CardEffectArgumentType[]
		) => {
			const effect = effects[chosenEffect]
			if (!effect) {
				throw new Error(`Unknown effect choice ${chosenEffect}`)
			}

			effect.perform(ctx, ...chosenArgs)
		},
	})

export const joinedEffects = (effects: CardEffect[]) =>
	effect({
		args: flatten(effects.map((e) => e.args)),
		description: effects.map((e) => e.description || '').join(' and '),
		conditions: flatten(effects.map((e) => e.conditions)),
		perform: (ctx, ...args) => {
			effects.forEach((e) => {
				e.perform(
					ctx,
					...(e.args.length > 0 ? args.splice(0, e.args.length) : [])
				)
			})
		},
	})

export const cardArg = (conditions: CardCondition[] = []) =>
	effectArg({
		type: CardEffectTarget.Card,
		cardConditions: conditions,
	})

export const cardResourceCondition = (res: CardResource, amount: number) =>
	condition({
		description: `Card has to have at least ${amount} of ${res} units`,
		evaluate: ({ card }) => card[res] >= amount,
	})

export const otherCardResourceChange = (res: CardResource, amount: number) =>
	effect({
		args: [
			{
				...cardArg([cardResourceCondition(res, amount)]),
				description:
					amount > 0
						? `Add ${amount} ${res} to`
						: `Remove ${-amount} ${res} from`,
			},
		],
		conditions: [],
		description:
			amount < 0
				? `Remove ${-amount} ${res} from any other card`
				: `Add ${amount} ${res} to any other card`,
		perform: ({ player }, [cardCode, cardIndex]: [string, number]) => {
			const card = CardsLookupApi.get(cardCode)
			const cardState = player.usedCards[cardIndex]

			if (!cardState || cardState.code !== card.code) {
				throw new Error(
					`Invalid card target (state found: ${!!cardState}, card code: ${cardCode} ?= ${
						card.code
					}`
				)
			}

			// TODO: Check if player can place it on this card
			cardState[res] += amount
		},
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
		},
	})

export const playerCardArg = (conditions: CardCondition[] = [], amount = 0) =>
	effectArg({
		type: CardEffectTarget.PlayerCardResource,
		cardConditions: conditions,
		amount,
	})

export const playerCardResourceChange = (res: CardResource, amount: number) =>
	effect({
		args:
			amount < 0
				? [playerCardArg([cardResourceCondition(res, -amount)], -amount)]
				: [],
		description:
			amount < 0
				? `Remove ${-amount} ${res} from any other player card`
				: `Add ${amount} ${res} to any other player card`,
		perform: (
			{ game },
			[playerId, cardCode, cardIndex]: [number, string, number]
		) => {
			const player = game.players.find((p) => p.id === playerId)?.gameState
			if (!player) {
				throw new Error(`Invalid player id ${playerId}`)
			}

			const card = CardsLookupApi.get(cardCode)
			const cardState = player.usedCards[cardIndex]

			if (!cardState || cardState.code !== card.code) {
				throw new Error(
					`Invalid card target (state found: ${!!cardState}, card code: ${cardCode} ?= ${
						card.code
					}`
				)
			}

			// TODO: Check if player can place it on this card
			cardState[res] += amount
		},
	})

export const productionChangeForTags = (
	res: Resource,
	change: number,
	tag: CardCategory
) => {
	const prod = resourceProduction[res]
	return effect({
		description: `Increase your ${res} production by ${change} for each ${CardCategory[tag]} card you have`,
		perform: ({ player }) => {
			player[prod] += change
		},
	})
}

export const cellArg = (conditions: CellCondition[], description?: string) =>
	effectArg({
		type: CardEffectTarget.Cell,
		description,
		cellConditions: conditions,
	})

export const card = (
	c: WithOptional<
		Card,
		| 'conditions'
		| 'playEffects'
		| 'passiveEffects'
		| 'actionEffects'
		| 'victoryPoints'
	>
) =>
	({
		victoryPoints: 0,
		conditions: [],
		passiveEffects: [],
		playEffects: [],
		actionEffects: [],
		...c,
	} as Card)

export const isCardPlayable = (card: Card, ctx: CardCallbackContext) =>
	!card.conditions.find((c) => !c.evaluate(ctx)) &&
	!card.playEffects.find((e) => e.conditions.find((c) => !c.evaluate(ctx)))

export const isCardActionable = (card: Card, ctx: CardCallbackContext) =>
	!ctx.card.played &&
	!card.actionEffects.find((e) => e.conditions.find((c) => !c.evaluate(ctx)))

export const emptyCardState = (cardCode: string) => ({
	code: cardCode,
	played: false,
	animals: 0,
	fighters: 0,
	microbes: 0,
	science: 0,
})
