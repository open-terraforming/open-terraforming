import { initialPlayerState } from '../../states'
import { prepareTestCard } from '../../test/utils'
import { adjustedCardPrice } from '../utils'
import { CardCategory } from '../types'

test('adjustedCardPrice should return normal price for normal cards', () => {
	const player = initialPlayerState(1)
	player.tagPriceChange[CardCategory.Animal] = -2
	player.tagPriceChange[CardCategory.Building] = -2
	player.tagPriceChange[CardCategory.Plant] = -2

	const testCard = prepareTestCard({
		cost: 10
	})

	expect(adjustedCardPrice(testCard, player)).toEqual(testCard.cost)
})

test('adjustedCardPrice should return discounted price for general discount', () => {
	const player = initialPlayerState(1)
	player.cardPriceChange = -5
	player.tagPriceChange[CardCategory.Animal] = -2
	player.tagPriceChange[CardCategory.Building] = -2
	player.tagPriceChange[CardCategory.Plant] = -2

	const testCard = prepareTestCard({
		cost: 10
	})

	expect(adjustedCardPrice(testCard, player)).toEqual(testCard.cost - 5)
})

test('adjustedCardPrice should return 0 when adjusted price is less than 0', () => {
	const player = initialPlayerState(1)
	player.cardPriceChange = -20
	player.tagPriceChange[CardCategory.Animal] = -2
	player.tagPriceChange[CardCategory.Building] = -2
	player.tagPriceChange[CardCategory.Plant] = -2

	const testCard = prepareTestCard({
		cost: 10
	})

	expect(adjustedCardPrice(testCard, player)).toEqual(0)
})

test('adjustedCardPrice should return discounted price for tags', () => {
	const player = initialPlayerState(1)
	player.tagPriceChange[CardCategory.Animal] = -2
	player.tagPriceChange[CardCategory.Building] = -2
	player.tagPriceChange[CardCategory.Plant] = -2

	expect(
		adjustedCardPrice(
			prepareTestCard({
				cost: 10
			}),
			player
		)
	).toEqual(10)

	expect(
		adjustedCardPrice(
			prepareTestCard({
				cost: 10,
				categories: [CardCategory.Animal]
			}),
			player
		)
	).toEqual(8)

	expect(
		adjustedCardPrice(
			prepareTestCard({
				cost: 10,
				categories: [CardCategory.Building]
			}),
			player
		)
	).toEqual(8)

	expect(
		adjustedCardPrice(
			prepareTestCard({
				cost: 10,
				categories: [CardCategory.Plant]
			}),
			player
		)
	).toEqual(8)

	expect(
		adjustedCardPrice(
			prepareTestCard({
				cost: 10,
				categories: [CardCategory.Animal, CardCategory.Building]
			}),
			player
		)
	).toEqual(6)
})
