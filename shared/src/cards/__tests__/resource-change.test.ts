import { prepareTestState } from '../../test/utils'
import { resourceChange } from '../effects'
import { emptyCardState } from '../utils'
import { Resource } from '../types'

const resources: Resource[] = [
	'money',
	'ore',
	'titan',
	'plants',
	'energy',
	'heat'
]

test('resourceChange should change resources of right player', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()

	resources.forEach(r => {
		state.players[0][r] = 2
		state.players[1][r] = 2
	})

	const ctx = {
		card,
		player: state.players[0],
		game: state
	}

	resources.forEach(r => {
		resourceChange(r, -2).perform(ctx)
		expect(state.players[0][r]).toBe(0)
		expect(state.players[1][r]).toBe(2)

		resourceChange(r, 3).perform(ctx)
		expect(state.players[0][r]).toBe(3)
		expect(state.players[1][r]).toBe(2)
	})
})

test("resourceChange won't allow negative result", () => {
	const card = emptyCardState('void')
	const state = prepareTestState(1)

	resources.forEach(r => {
		state.players[0][r] = 2
	})

	const ctx = {
		card,
		player: state.players[0],
		game: state
	}

	resources.forEach(r => {
		expect(resourceChange(r, -4).conditions.find(c => !c.evaluate(ctx)))
		expect(() => resourceChange(r, -4).perform(ctx)).toThrowError()
	})
})
