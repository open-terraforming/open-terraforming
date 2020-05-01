import {
	GridCell,
	GridCellContent,
	UsedCardState,
	GameState,
	PlayerState
} from '../game'
import { Card, CardCallbackContext, CardCondition } from '../cards'

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
			cell => !this.conditions.find(condition => !condition(cell))
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
		this.list = sortBy(this.list, score)
	}

	not() {
		this.nextNegative = true
	}

	map<R>(mapping: (i: T) => R) {
		return this.list.map(mapping)
	}
}

export class TileCollection extends FilteredCollection<GridCell> {
	ownedBy(playerId: number) {
		return this.c((c: GridCell) => c.ownerId === playerId)
	}

	notOwnedBy(playerId: number) {
		return this.c((c: GridCell) => c.ownerId !== playerId)
	}

	hasContent(content: GridCellContent) {
		return this.c((c: GridCell) => c.content === content)
	}

	hasAnyContent(content: GridCellContent[]) {
		return this.c(
			(c: GridCell) => c.content !== undefined && content.includes(c.content)
		)
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
					c =>
						!c.evaluate({
							game,
							player,
							card: i.state,
							cardIndex: i.state.index,
							playerId: player.id
						})
				)
		)
	}
}

export const sortBy = <T>(a: T[], score: (a: T) => number) => {
	return a
		.map(i => [score(i), i] as const)
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
	source = {} as Record<Extract<T[K], string | number | symbol>, T>
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
