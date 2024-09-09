import { initialGameState, initialPlayerState } from '@shared/states'
import { emptyCardState, isCardPlayable } from '../utils'
import { CardsLookupApi } from '../lookup'

test('should return true if card is playable', () => {
	expect(
		isCardPlayable(CardsLookupApi.get('robotic_workforce'), {
			card: emptyCardState('robotic_workforce'),
			game: initialGameState(),
			player: initialPlayerState(),
		}),
	).toBe(false)
})
