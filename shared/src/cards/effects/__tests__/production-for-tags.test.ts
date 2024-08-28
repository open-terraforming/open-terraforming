import { prepareTestState } from '../../../test/utils'
import { emptyCardState } from '../../utils'
import { productionForTags } from '../production-for-tags'
import { CardCategory } from '../../types'

test('productionForTags should change production based on tag count', () => {
	const card = emptyCardState('power_grid')
	const game = prepareTestState()

	const player = (game.players[0] = {
		...game.players[0],
		energyProduction: 1,
		usedCards: [
			emptyCardState('lunar_beam'),
			emptyCardState('lightning_harvest'),
			emptyCardState('space_mirrors'),
		],
	})

	productionForTags(CardCategory.Power, 'energy', 2).perform({
		card,
		game,
		player,
	})

	expect(player.energyProduction).toBe(9)
})
