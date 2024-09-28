import { initialPlayerState } from '../../states'
import { prepareTestCard } from '../../test/utils'
import { CardCategory } from '../types'
import { minimalCardPrice } from '../utils'

test('minimalCardPrice should return normal price for normal cards', () => {
	const player = initialPlayerState(1)

	const testCard = prepareTestCard({
		categories: [CardCategory.Plant],
		cost: 10,
	})

	expect(minimalCardPrice(testCard, player)).toEqual(testCard.cost)
})

test('minimalCardPrice should return discounted price for buildings', () => {
	const player = initialPlayerState(1)
	player.ore = 2
	player.orePrice = 2

	const testCard = prepareTestCard({
		categories: [CardCategory.Building],
		cost: 10,
	})

	expect(minimalCardPrice(testCard, player)).toEqual(testCard.cost - 4)
})

test('minimalCardPrice should return discounted price for space cards', () => {
	const player = initialPlayerState(1)
	player.titan = 2
	player.titanPrice = 3

	const testCard = prepareTestCard({
		categories: [CardCategory.Space],
		cost: 10,
	})

	expect(minimalCardPrice(testCard, player)).toEqual(testCard.cost - 6)
})

test('minimalCardPrice should return 0 when discounted prices is less than 0', () => {
	const player = initialPlayerState(1)
	player.titan = 10
	player.titanPrice = 3

	const testCard = prepareTestCard({
		categories: [CardCategory.Space],
		cost: 10,
	})

	expect(minimalCardPrice(testCard, player)).toEqual(0)
})

test('minimalCardPrice should return discounted price when player has discount', () => {
	const player = initialPlayerState(1)
	player.titan = 1
	player.titanPrice = 3
	player.cardPriceChanges.push({ change: -2 })
	player.tagPriceChanges.push({ tag: CardCategory.Space, change: -2 })

	const testCard = prepareTestCard({
		categories: [CardCategory.Space],
		cost: 10,
	})

	expect(minimalCardPrice(testCard, player)).toEqual(testCard.cost - 7)
})
