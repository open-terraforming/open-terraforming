interface LocalLinkedListItem<T> {
	prev?: LocalLinkedListItem<T>
	next?: LocalLinkedListItem<T>
	value: T
}

export interface LinkedListItem<T> {
	readonly prev?: LinkedListItem<T>
	readonly next?: LinkedListItem<T>
	readonly value: T
}

/**
 * Basic Linked List implementation sufficient enought to be used in cache.
 */
export class LinkedList<T> {
	start?: LocalLinkedListItem<T>
	end?: LocalLinkedListItem<T>
	length = 0

	push(value: T): LinkedListItem<T> {
		const item = { prev: this.end, value }

		if (!this.start) {
			this.start = item
		}

		if (this.end) {
			this.end.next = item
		}

		this.end = item
		this.length++

		return item
	}

	remove(item: LocalLinkedListItem<T>) {
		if (this.length === 0) {
			throw new Error('Trying to remove item from empty list')
		}

		if (item === this.start && item === this.end) {
			this.start = undefined
			this.end = undefined
		} else if (item === this.start) {
			this.start = this.start.next

			if (this.start) {
				this.start.prev = undefined
			}
		} else if (item === this.end) {
			this.end = this.end.prev

			if (this.end) {
				this.end.next = undefined
			}
		} else {
			if (item.prev) {
				item.prev.next = item.next
			}

			if (item.next) {
				item.next.prev = item.prev
			}
		}

		this.length--
	}

	find(value: T): LinkedListItem<T> | undefined {
		let item = this.start

		while (item) {
			if (item.value === value) {
				return item
			}

			item = item.next
		}

		return undefined
	}

	shift() {
		if (this.start) {
			const value = this.start.value

			this.length--

			if (this.start === this.end) {
				this.start = undefined
				this.end = undefined
			} else {
				this.start = this.start.next

				if (this.start) {
					this.start.prev = undefined
				}
			}

			return value
		}

		return undefined
	}

	toArray() {
		const result = [] as T[]
		let item = this.start

		while (item) {
			result.push(item.value)
			item = item.next
		}

		return result
	}
}
