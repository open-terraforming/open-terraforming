import { prepareTestState } from '../../test/utils'
import { emptyCardState } from '../utils'
import { joinedEffects, playerResourceChange, resourceChange } from '../effects'

test('joinedEffect should properly work with arguments', () => {
	const card = emptyCardState('void')
	const state = prepareTestState()

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
