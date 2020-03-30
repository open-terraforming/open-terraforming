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
} from './types'
import {
	GameState,
	GridCellContent,
	GridCellOther,
	PlayerStateValue,
	GridCell,
	GridCellSpecial,
} from '../game'
import { CardsLookup, CardsLookupApi } from '.'
import { withUnits } from '../units'

export const vpCb = (cb: CardVictoryPointsCallback) => cb

const resourceProduction = {
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

export const countGridContent = (game: GameState, content: GridCellContent) => {
	return game.map.grid.reduce(
		(acc, c) => acc + c.filter((c) => c.content === content).length,
		0
	)
}

export const allCells = (game: GameState) => {
	return game.map.grid.reduce((acc, c) => [...acc, ...c], [] as GridCell[])
}

export const adjacentCells = (game: GameState, x: number, y: number) => {
	const g = game.map.grid
	const w = game.map.width
	const h = game.map.height

	return [
		...(y > 0
			? [x > 0 && g[x - 1][y - 1], g[x][y - 1], x < w - 1 && g[x + 1][y - 1]]
			: []),
		x > 0 && g[x - 1][y],
		x < w - 1 && g[x + 1][y],
		...(y < h - 1
			? [x > 0 && g[x - 1][y + 1], g[x][y + 1], x < w - 1 && g[x + 1][y + 1]]
			: []),
	].filter((c) => c && c.enabled) as GridCell[]
}

export const effect = <T extends CardEffectArgumentType[]>(
	c: WithOptional<CardEffect<T>, 'args' | 'conditions'>
): CardEffect<T> =>
	({
		args: [],
		conditions: [],
		...c,
	} as CardEffect)

export const effectArg = (
	c: WithOptional<CardEffectArgument, 'playerConditions'>
) =>
	({
		playerConditions: [],
		...c,
	} as CardEffectArgument)

export const condition = (c: CardCondition) => c

export const drawnCards = (amount = 1) =>
	effectArg({
		type: CardEffectTarget.DrawnCards,
		drawnCards: amount,
	})

export const cardCountCondition = (category: CardCategory, value: number) =>
	condition({
		evaluate: ({ player }) =>
			player.usedCards
				.map((c) => CardsLookup[c.code])
				.filter((c) => c && c.categories.includes(category)).length >= value,
		description: `Requires ${value} of ${CardCategory[category]} cards`,
	})

export const gameProgressConditionMin = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game }) => game[res] >= value,
		description: `${res} has to be at least ${value}`,
	})

export const gameProgressConditionMax = (res: GameProgress, value: number) =>
	condition({
		evaluate: ({ game }) => game[res] >= value,
		description: `${res} has to be at most ${value}`,
	})

export const resourceCondition = (res: Resource, value: number) =>
	condition({
		evaluate: ({ player }) => player[res] >= value,
		description: `You have to at least ${value} of ${res}`,
	})

export const cellTypeCondition = (type: GridCellContent, amount: number) =>
	condition({
		description: `Requires at least ${amount} of ${type} to be placed`,
		evaluate: ({ game }) => countGridContent(game, type) >= amount,
	})

export const resourceChange = (res: Resource, change: number) =>
	effect({
		conditions: change < 0 ? [resourceCondition(res, -change)] : [],
		description:
			change > 0
				? `You'll receive ${change} of ${res}`
				: `You'll loose ${-change} of ${res}`,
		perform: ({ player }) => {
			player[res] += change
		},
	})

export const productionCondition = (res: Resource, value: number) => {
	const prod = resourceProduction[res]
	return condition({
		evaluate: ({ player }) => player[prod] >= value,
		description: `Your production of ${res} has to be at least ${value}`,
	})
}

export const productionChange = (res: Resource, change: number) => {
	const prod = resourceProduction[res]
	return effect({
		conditions:
			change < 0 && res !== 'money' ? [productionCondition(res, -change)] : [],
		description:
			change > 0
				? `Your production of ${res} will increase by ${change}`
				: `Your production of ${res} will decrease by ${change}`,
		perform: ({ player }) => {
			player[prod] += change
		},
	})
}

export const playerResourceChange = (res: Resource, change: number) => {
	return effect({
		args: [
			effectArg({
				type: CardEffectTarget.PlayerResource,
				maxAmount: change,
				resource: res,
				playerConditions:
					change < 0 ? [resourceCondition(res, 1) as PlayerCondition] : [],
			}),
		],
		description:
			change > 0
				? `Give up to ${withUnits(res, change)} to any player`
				: `Remove up to ${withUnits(res, change)} from any player`,
		perform: ({ game }, playerId: number) => {
			playerId >= 0 && (gamePlayer(game, playerId)[res] += change)
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
				description: `Decrease ${res} production by ${change} of`,
			}),
		],
		description:
			change > 0
				? `Increase ${res} production of any player by ${change}`
				: `Decrease ${res} production of any player by ${change}`,
		perform: ({ game }, playerId: number) => {
			playerId >= 0 && (gamePlayer(game, playerId)[prod] += change)
		},
	})
}

export const gameProcessChange = (res: GameProgress, change: number) => {
	return effect({
		description:
			change > 0
				? `Increase ${res} by ${change} step`
				: `Decrease ${res} by ${change} step`,
		perform: ({ game }) => {
			game[res] += change
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

export const placeTile = (
	type: GridCellContent,
	other?: GridCellOther,
	special?: GridCellSpecial
) =>
	effect({
		description: `Place a ${
			other ? GridCellOther[other] : GridCellContent[type]
		} tile`,
		perform: ({ player, cardIndex }) => {
			player.placingTile = {
				type,
				other,
				ownerCard: cardIndex,
				special,
			}
			player.state = PlayerStateValue.PlacingTile
		},
	})

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

export const card = (
	c: WithOptional<
		Card,
		| 'conditions'
		| 'playEffects'
		| 'permanentEffects'
		| 'actionEvents'
		| 'victoryPoints'
	>
) =>
	({
		victoryPoints: 0,
		conditions: [],
		permanentEffects: [],
		playEffects: [],
		actionEvents: [],
		...c,
	} as Card)
