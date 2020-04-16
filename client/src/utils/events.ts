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

	on(handler: EventHandler<T>) {
		this.listeners.push(handler)

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
		const handler = (e: T) => {
			handle(e)
			this.off(handler)
		}

		this.on(handler)
	}

	emit(e: T) {
		this.listeners.forEach(l => {
			l(e)
		})
	}
}
