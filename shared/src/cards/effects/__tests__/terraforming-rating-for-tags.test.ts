import { prepareTestState } from '../../../test/utils'
import { emptyCardState } from '../../utils'
import { terraformRatingForTags } from '../../effects'
import { CardCategory } from '../../types'

test('terraformRatingForTags should change production based on tag count', () => {
	const card = emptyCardState('terraforming_ganymede')
	const game = prepareTestState()

	const player = (game.players[0] = {
		...game.players[0],
		terraformRating: 5,
		usedCards: [
			emptyCardState('colonizer_training_camp'),
			emptyCardState('asteroid_mining_consortium'),
			emptyCardState('methane_from_titan')
		]
	})

	terraformRatingForTags(CardCategory.Jupiter, 2).perform({
		card,
		game,
		player
	})

	expect(player.terraformRating).toBe(13)
})
