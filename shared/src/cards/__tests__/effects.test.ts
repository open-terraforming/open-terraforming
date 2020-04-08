import { emptyCardState } from '../utils'
import { initialGameState, initialPlayerState } from '../../states'
import { playerResourceChange, joinedEffects, resourceChange } from '../effects'

const prepareState = () => {
	const game = initialGameState()
	game.players.push(initialPlayerState(1, 's1'))
	game.players.push(initialPlayerState(2, 's2'))
	return game
}

test('playerResourceChange should change resources of right player', () => {
	const card = emptyCardState('void')
	const state = prepareState()
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
	const state = prepareState()
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

test('joinedEffect should properly work with arguments', () => {
	const card = emptyCardState('void')
	const state = prepareState()

	state.players[0] = {
		...state.players[0],
		ore: 3,
		money: 5
	}

	state.players[1] = {
		...state.players[1],
		ore: 2,
		money: 3
	}

	joinedEffects([
		playerResourceChange('ore', -2, false),
		resourceChange('ore', 2)
	]).perform(
		{
			card,
			cardIndex: 0,
			player: state.players[0],
			playerId: state.players[0].id,
			game: state
		},
		[state.players[1].id, 2]
	)

	expect(state.players[0].ore).toBe(5)
	expect(state.players[1].ore).toBe(0)
})
