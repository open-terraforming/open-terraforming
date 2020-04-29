export const captureEnter = (callback: (e: React.KeyboardEvent) => void) => (
	e: React.KeyboardEvent
) => {
	if (e.key === 'Enter') {
		e.preventDefault()
		e.stopPropagation()

		callback(e)
	}
}

export const stopEvent = <T extends React.SyntheticEvent>(
	callback: (e: T) => void
) => (e: T) => {
	e.stopPropagation()
	e.preventDefault()

	callback(e)
}

type EventHandler<T> = (e: T) => void

export class MyEvent<T = void> {
	listeners: EventHandler<T>[] = []

	emitted?: boolean
	lastEmit?: T
	rememberLastEmit: boolean

	constructor(rememberLastEmit = false) {
		this.rememberLastEmit = rememberLastEmit
	}

	on(handler: EventHandler<T>) {
		this.listeners.push(handler)

		if (this.rememberLastEmit && this.emitted) {
			handler(this.lastEmit as T)
		}

		return handler
	}

	off(handler: EventHandler<T>) {
		const index = this.listeners.indexOf(handler)

		if (index >= 0) {
			this.listeners.splice(index, 1)

			return true
		}

		return false
	}

	once(handle: EventHandler<T>) {
		if (this.rememberLastEmit && this.emitted) {
			handle(this.lastEmit as T)
		} else {
			const handler = (e: T) => {
				handle(e)
				this.off(handler)
			}

			this.on(handler)
		}
	}

	emit(e: T) {
		if (this.rememberLastEmit) {
			this.emitted = true
			this.lastEmit = e
		}

		this.listeners.forEach(l => {
			l(e)
		})
	}
}
