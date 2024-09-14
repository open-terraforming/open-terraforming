/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardCondition } from '../cards'
import {
	GameState,
	GridCell,
	GridCellContent,
	PlayerState,
	PlayerStateValue,
	UsedCardState,
} from '../game'
import { PlayerAction, PlayerActionType } from '../player-actions'

export const allCells = (game: GameState) => {
	return game.map.grid
		.reduce((acc, c) => [...acc, ...c], [] as GridCell[])
		.filter((c) => c.enabled)
}

export const adjacentCells = (game: GameState, x: number, y: number) => {
	const g = game.map.grid
	const w = game.map.width
	const h = game.map.height

	return [
		...(y > 0
			? [
					y % 2 === 0 && x > 0 && g[x - 1][y - 1],
					g[x][y - 1],
					y % 2 === 1 && x < w - 1 && g[x + 1][y - 1],
				]
			: []),
		x > 0 && g[x - 1][y],
		x < w - 1 && g[x + 1][y],
		...(y < h - 1
			? [
					y % 2 === 0 && x > 0 && g[x - 1][y + 1],
					g[x][y + 1],
					y % 2 === 1 && x < w - 1 && g[x + 1][y + 1],
				]
			: []),
	].filter((c) => c && c.enabled) as GridCell[]
}

export const ucFirst = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1)

export const drawPreludeCards = (game: GameState, count: number) =>
	range(0, count).map(() => drawPreludeCard(game))

export const drawPreludeCard = (game: GameState) => {
	if (game.preludeCards.length === 0) {
		game.preludeCards = shuffle(game.preludeDiscarded.slice(0))
		game.preludeDiscarded = []
	}

	if (game.preludeCards.length === 0) {
		throw new Error(`There are no more prelude cards.`)
	}

	return game.preludeCards.pop() as string
}

export const drawCard = (game: GameState) => {
	if (game.cards.length === 0) {
		game.cards = shuffle(game.discarded.slice(0))
		game.discarded = []
	}

	if (game.cards.length === 0) {
		const played = game.players.reduce(
			(acc, p) => acc + p.cards.length + p.usedCards.length,
			0,
		)

		throw new Error(
			`There are no more cards. Players have ${played} in their hands`,
		)
	}

	return game.cards.pop() as string
}

export const drawCards = (game: GameState, count: number) =>
	range(0, count).map(() => drawCard(game))

export const drawCorporation = (game: GameState) => {
	if (game.corporations.length === 0) {
		game.corporations = shuffle(game.corporationsDiscarded.slice(0))
		game.corporationsDiscarded = []
	}

	if (game.corporations.length === 0) {
		throw new Error(`There are no more corporations to pick from`)
	}

	return game.corporations.pop() as string
}

export const drawCorporations = (game: GameState, count: number) =>
	range(0, count).map(() => drawCorporation(game))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const f = (s: string, ...args: any[]) =>
	args.reduce(
		(s, a, i) =>
			s.replace(
				`{${i}}`,
				typeof a === 'object' && typeof a.toString === 'function'
					? a.toString()
					: a,
			),
		s,
	)

/**
 * Removes control characters from input string
 * @param str
 */
export const sanitize = (str?: string) =>
	str ? str.trim().replace(/[\x00-\x1F\x7F-\x9F\u200f]/g, '') : str

/**
 * Returns length of string without special characters
 * @param str
 */
export const nonEmptyStringLength = (str?: string) =>
	str ? str.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF ]/g, '').length : 0

export const competitionPrice = (game: GameState) => {
	return game.competitionsPrices[
		Math.min(game.competitionsPrices.length - 1, game.competitions.length)
	]
}

export const pushPendingAction = (
	player: PlayerState,
	action: PlayerAction,
) => {
	player.pendingActions.push(action)
}

const allowedActions: Record<number, PlayerActionType[] | undefined> = {
	[PlayerStateValue.Picking]: [
		PlayerActionType.PickStarting,
		PlayerActionType.PickCards,
		PlayerActionType.PickPreludes,
		PlayerActionType.DraftCard,
	],
	[PlayerStateValue.Prelude]: [PlayerActionType.PlaceTile],
	[PlayerStateValue.EndingTiles]: [PlayerActionType.PlaceTile],
	[PlayerStateValue.Playing]: [],
	[PlayerStateValue.SolarPhaseTerraform]: [
		PlayerActionType.SolarPhaseTerraform,
		PlayerActionType.ClaimTile,
		PlayerActionType.PlaceTile,
	],
}

export const pendingActions = (player: PlayerState) => {
	const allowed = allowedActions[player.state]

	return allowed
		? allowed.length === 0
			? player.pendingActions
			: player.pendingActions.filter((p) => allowed.includes(p.type))
		: []
}

export const allTiles = (game: GameState) => new TileCollection(allCells(game))
export const tiles = (list: GridCell[]) => new TileCollection(list)
export const adjTilesList = (game: GameState, x: number, y: number) =>
	new TileCollection(adjacentCells(game, x, y))

/**
 * Generates array containing numbers between start and end (excluding).
 * @param start beginning number
 * @param end ending number (excluding)
 * @param step range step, defaults to 1
 */
export function range(start: number, end: number, step = 1) {
	const result = [] as number[]

	for (let i = start; i < end; i += step) {
		result.push(i)
	}

	return result
}

export const flatten = <T>(a: T[][]) =>
	a.reduce((acc, a) => [...acc, ...a], [] as T[])

type CollectionCondition<T> = (c: T) => boolean

export class FilteredCollection<T> {
	protected __evaluated: T[] | undefined

	protected nextNegative = false

	protected list: T[]
	protected conditions = [] as CollectionCondition<T>[]

	constructor(list: T[]) {
		this.list = list
	}

	get length() {
		return this.asArray().length
	}

	asArray() {
		if (this.__evaluated) {
			return this.__evaluated
		}

		return (this.__evaluated = this.list.filter(
			(cell) => !this.conditions.find((condition) => !condition(cell)),
		))
	}

	c(c: CollectionCondition<T>) {
		if (this.nextNegative) {
			c = (i: T) => !c(i)
			this.nextNegative = false
		}

		this.conditions.push(c)
		this.__evaluated = undefined

		return this
	}

	sortBy(score: (i: T) => number) {
		return sortBy(this.asArray(), score)
	}

	not() {
		this.nextNegative = true
	}

	map<R>(mapping: (i: T) => R) {
		return this.asArray().map(mapping)
	}
}

export class TileCollection extends FilteredCollection<GridCell> {
	ownedBy(playerId: number) {
		return this.c(
			(c: GridCell) =>
				c.ownerId === playerId && c.content !== GridCellContent.Ocean,
		)
	}

	notOwnedBy(playerId: number) {
		return this.c((c: GridCell) => c.ownerId !== playerId)
	}

	hasContent(content: GridCellContent) {
		return this.c((c: GridCell) => c.content === content)
	}

	hasAnyContent(content: GridCellContent[]) {
		return this.c(
			(c: GridCell) => c.content !== undefined && content.includes(c.content),
		)
	}

	nextTo(game: GameState, content: GridCellContent) {
		return this.c(
			(c) =>
				adjacentCells(game, c.x, c.y).find((c) => c.content === content) !==
				undefined,
		)
	}

	onMars() {
		return this.c((c: GridCell) => !c.outside)
	}

	hasCity = () => this.hasContent(GridCellContent.City)
	hasOcean = () => this.hasContent(GridCellContent.Ocean)
	hasGreenery = () => this.hasContent(GridCellContent.Forest)
	hasOther = () => this.hasContent(GridCellContent.Other)
}

type CardInfo = {
	info: Card
	state: UsedCardState
}

export class CardsCollection extends FilteredCollection<CardInfo> {
	fits(game: GameState, player: PlayerState, conditions: CardCondition[]) {
		return this.c(
			(i: CardInfo) =>
				!conditions.find(
					(c) =>
						!c.evaluate({
							game,
							player,
							card: i.state,
						}),
				),
		)
	}
}

export const sortBy = <T>(a: T[], score: (a: T) => number) => {
	return a
		.map((i) => [score(i), i] as const)
		.sort(([a], [b]) => a - b)
		.map(([, i]) => i)
}

type KeysMatching<T, V> = {
	[K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * Creates map from array using specified key.
 * @param collection array of items
 * @param key key to be used in the map
 */
export function keyMap<T, K extends KeysMatching<T, string | number>>(
	collection: T[],
	key: K,
	source = {} as Record<Extract<T[K], string | number | symbol>, T>,
): Record<Extract<T[K], string | number | symbol>, T> {
	return collection.reduce((acc, item) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		acc[item[key] as Extract<T[K], string | number | symbol>] = item

		return acc
	}, source)
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle<T>(a: T[]) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		// eslint-disable-next-line padding-line-between-statements
		;[a[i], a[j]] = [a[j], a[i]]
	}

	return a
}

export const voidReduce = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => any,
) => {
	return array.reduce((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}

export const voidReduceRight = <T, R>(
	array: T[],
	accumulator: R,
	callback: (accumulator: R, item: T, index: number) => any,
) => {
	return array.reduceRight((acc, item, index) => {
		callback(acc, item, index)

		return acc
	}, accumulator)
}

export const mapRight = <T, R>(
	array: T[],
	callback: (item: T, index: number) => R,
): R[] =>
	voidReduceRight(array, [] as R[], (acc, item, index) =>
		acc.push(callback(item, index)),
	)

export const isMarsTerraformed = (game: GameState) => {
	return (
		game.oceans >= game.map.oceans &&
		game.oxygen >= game.map.oxygen &&
		game.temperature >= game.map.temperature
	)
}

export const getPlayerIndex = (game: GameState, playerId: number) =>
	game.players.findIndex((p) => p.id === playerId)

export const mod = (n: number, m: number) => {
	return ((n % m) + m) % m
}

export const pickRandom = <T>(array: T[]) => {
	return array[Math.round(Math.random() * (array.length - 1))]
}

export * from './ok'
export * from './okOrFailure'
export * from './failure'
export * from './isOk'
export * from './isFailure'
