import { GameState, GridCell, GridCellContent, PlayerGameState } from '../game'
import { withUnits } from '../units'
import {
	Card,
	CardCallbackContext,
	CardCategory,
	CardType,
	Resource,
	WithOptional
} from './types'

export const resourceProduction = {
	money: 'moneyProduction',
	ore: 'oreProduction',
	titan: 'titanProduction',
	plants: 'plantsProduction',
	energy: 'energyProduction',
	heat: 'heatProduction'
} as const

export const productionResource = {
	moneyProduction: 'money',
	oreProduction: 'ore',
	titanProduction: 'titan',
	plantsProduction: 'plants',
	energyProduction: 'energy',
	heatProduction: 'heat'
} as const

export const resToPrice = {
	ore: 'orePrice',
	titan: 'titanPrice'
} as const

export const gamePlayer = (game: GameState, playerId: number) => {
	const p = game.players.find(p => p.id === playerId)
	if (!p) {
		throw new Error(`Failed to find player #${playerId}`)
	}
	return p
}

export const cellByCoords = (game: GameState, x: number, y: number) => {
	const spec = game.map.special.find(s => s.x === x && s.y === y)
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
				c =>
					c.content === content &&
					(playerId === undefined || c.ownerId === playerId)
			).length,
		0
	)
}

export const card = (
	c: WithOptional<
		Card,
		| 'conditions'
		| 'playEffects'
		| 'passiveEffects'
		| 'actionEffects'
		| 'victoryPoints'
		| 'description'
		| 'special'
	>
) =>
	({
		victoryPoints: 0,
		conditions: [],
		passiveEffects: [],
		playEffects: [],
		actionEffects: [],
		special: [],
		description: '',
		...c
	} as Card)

export const isCardPlayable = (card: Card, ctx: CardCallbackContext) =>
	!card.conditions.find(c => !c.evaluate(ctx)) &&
	!card.playEffects.find(e => e.conditions.find(c => !c.evaluate(ctx)))

export const isCardActionable = (card: Card, ctx: CardCallbackContext) =>
	(card.type === CardType.Action || card.type === CardType.Corporation) &&
	!ctx.card.played &&
	card.actionEffects.length > 0 &&
	!card.actionEffects.find(e => e.conditions.find(c => !c.evaluate(ctx)))

export const emptyCardState = (cardCode: string) => ({
	code: cardCode,
	played: false,
	animals: 0,
	fighters: 0,
	microbes: 0,
	science: 0
})

export const minimalCardPrice = (card: Card, player: PlayerGameState) =>
	Math.max(
		0,
		adjustedCardPrice(card, player) -
			(card.categories.includes(CardCategory.Building)
				? player.ore * player.orePrice
				: 0) -
			(card.categories.includes(CardCategory.Space)
				? player?.titan * player?.titanPrice
				: 0)
	)

export const adjustedCardPrice = (card: Card, player: PlayerGameState) =>
	Math.max(
		0,
		card.cost +
			card.categories.reduce(
				(acc, c) => acc + (player.tagPriceChange[c] ?? 0),
				0
			) +
			player.cardPriceChange
	)

export const updatePlayerResource = (
	player: PlayerGameState,
	res: Resource,
	amount: number
) => {
	if (amount < 0 && player[res] < -amount) {
		throw new Error(
			`Player doesn't have ${withUnits(res, -amount)}! Owned: ${withUnits(
				res,
				player[res]
			)}`
		)
	}

	player[res] += amount
}

export const updatePlayerProduction = (
	player: PlayerGameState,
	res: Resource,
	amount: number
) => {
	const prod = resourceProduction[res]

	if (res !== 'money' && amount < 0 && player[prod] < -amount) {
		throw new Error(`Player doesn't have ${res} production of ${-amount}!`)
	}

	player[prod] += amount
}

export const noDesc = <T extends { description?: string }>(e: T) => {
	delete e.description
	return e
}
