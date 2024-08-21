import { MyEvent } from '@/utils/events'

export class StateMachine<Name extends string | number = string> {
	private states = [] as State<Name>[]
	private dictionary = {} as Record<Name, State<Name>>

	currentState?: State<Name>

	onStateChanged = new MyEvent<{ old?: State<Name>; current: State<Name> }>()

	addState(state: State<Name>) {
		this.states.push(state)

		if (state.name !== undefined) {
			this.dictionary[state.name] = state
		}

		return this
	}

	protected shouldSwitchState(): Name | undefined {
		return this.currentState?.transition()
	}

	update() {
		const updated = this.currentState?.update()

		// Keep switching states until we stop at one
		while (true) {
			const newState = this.shouldSwitchState()

			if (newState !== undefined) {
				this.setState(newState)
			} else {
				break
			}
		}

		return updated
	}

	setState(name: Name) {
		const old = this.currentState
		const newState = this.findState(name)

		if (old === newState) {
			return
		}

		if (old !== undefined) {
			this.onStateLeave(old, newState)
		}

		this.currentState = newState

		this.onStateEnter(old, this.currentState)

		this.onStateChanged.emit({
			old,
			current: this.currentState,
		})
	}

	findState(name: Name) {
		const result = this.dictionary[name]

		if (result === undefined) {
			throw new Error(`Unknown state ${name}`)
		}

		return result
	}

	protected onStateLeave(state: State<Name>, nextState: State<Name>) {
		state.onLeave(nextState)
	}

	protected onStateEnter(
		prevState: State<Name> | undefined,
		newState: State<Name>,
	) {
		newState.onEnter(prevState)
	}
}

export abstract class State<Name extends string | number> {
	readonly name?: Name

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onEnter(_prevState?: State<Name>) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onLeave(_nextState: State<Name>) {}

	/**
	 * Called when game state was updated. Returning truthy value will enqueue another update after this update.
	 */
	update(): boolean | undefined | void {
		return false
	}

	transition(): Name | undefined {
		return undefined
	}
}
