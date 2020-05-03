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

		return this.states.length
	}

	protected shouldSwitchState(): Name | undefined {
		return this.currentState?.transition()
	}

	update() {
		const newState = this.shouldSwitchState()

		if (newState !== undefined) {
			this.setState(newState)
		}

		return this.currentState?.update()
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
			current: this.currentState
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
		newState: State<Name>
	) {
		newState.onEnter(prevState)
	}
}

export abstract class State<Name extends string | number> {
	readonly name?: Name

	onEnter(prevState?: State<Name>) {}
	onLeave(nextState: State<Name>) {}

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
