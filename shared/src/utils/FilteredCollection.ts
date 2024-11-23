import { CollectionCondition } from '.'
import { sortBy } from './sortBy'

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
