import { prepareTestState } from '../../test/utils'
import { playerResourceChange } from '../effects'
import { emptyCardState } from '../utils'

test('playerResourceChange should change resources of right player', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[0].ore = 2
	state.players[1].ore = 3

	playerResourceChange('ore', -2).perform(
		{
			card,
			cardIndex: 0,
			player: state.players[0],
			playerId: state.players[0].id,
			game: state
		},
		[state.players[1].id, 2]
	)

	expect(state.players[0].ore).toBe(2)
	expect(state.players[1].ore).toBe(1)
})

test("playerResourceChange won't remove more than player owns", () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[0].ore = 2
	state.players[1].ore = 3

	expect(() => {
		playerResourceChange('ore', -5).perform(
			{
				card,
				cardIndex: 0,
				player: state.players[0],
				playerId: state.players[0].id,
				game: state
			},
			[state.players[1].id, 5]
		)
	}).toThrow()

	expect(state.players[0].ore).toBe(2)
	expect(state.players[1].ore).toBe(3)
})

test('playerResourceChange is limited by maximum number of resources', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[1].ore = 20

	playerResourceChange('ore', -5).perform(
		{
			card,
			cardIndex: 0,
			player: state.players[0],
			playerId: state.players[0].id,
			game: state
		},
		[state.players[1].id, 10]
	)

	expect(state.players[1].ore).toBe(15)
})

test('playerResourceChange removes exact amount when not optional', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[1].ore = 20

	playerResourceChange('ore', -5, false).perform(
		{
			card,
			cardIndex: 0,
			player: state.players[0],
			playerId: state.players[0].id,
			game: state
		},
		[state.players[1].id, 3]
	)

	expect(state.players[1].ore).toBe(15)
})

test('playerResourceChange accepts single arg when not optional', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[1].ore = 20

	playerResourceChange('ore', -5, false).perform(
		{
			card,
			cardIndex: 0,
			player: state.players[0],
			playerId: state.players[0].id,
			game: state
		},
		state.players[1].id
	)

	expect(state.players[1].ore).toBe(15)
})

test('playerResourceChange requires player not optional', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()
	state.players[1].ore = 20

	expect(() =>
		playerResourceChange('ore', -5, false).perform(
			{
				card,
				cardIndex: 0,
				player: state.players[0],
				playerId: state.players[0].id,
				game: state
			},
			-1
		)
	).toThrowError()

	expect(state.players[1].ore).toBe(20)
})