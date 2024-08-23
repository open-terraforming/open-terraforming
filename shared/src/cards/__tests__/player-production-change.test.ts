import { prepareTestState } from '../../test/utils'
import { playerProductionChange } from '../effects'
import { emptyCardState } from '../utils'

test('playerProductionChange should change production of right player', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()

	state.players[0].oreProduction = 2
	state.players[1].oreProduction = 3

	playerProductionChange('ore', 2).perform(
		{
			card,
			player: state.players[0],
			game: state,
		},
		state.players[1].id,
	)

	expect(state.players[0].oreProduction).toBe(2)
	expect(state.players[1].oreProduction).toBe(5)
})

test("playerProductionChange won't allow negative production (except money)", () => {
	const card = emptyCardState('void')
	const state = prepareTestState()

	state.players[0].oreProduction = 2
	state.players[1].oreProduction = 3

	expect(() => {
		playerProductionChange('ore', -5).perform(
			{
				card,
				player: state.players[0],
				game: state,
			},
			state.players[1].id,
		)
	}).toThrow()

	expect(state.players[0].oreProduction).toBe(2)
	expect(state.players[1].oreProduction).toBe(3)

	expect(() => {
		playerProductionChange('money', -5).perform(
			{
				card,
				player: state.players[0],
				game: state,
			},
			state.players[1].id,
		)
	}).not.toThrowError()

	expect(state.players[0].moneyProduction).toBe(0)
	expect(state.players[1].moneyProduction).toBe(-5)
})
