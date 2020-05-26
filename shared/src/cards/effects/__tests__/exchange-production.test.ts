import { prepareTestState } from '../../../test/utils'
import { emptyCardState } from '../../utils'
import { exchangeProduction } from '../exchange-production'

test('exchangeProduction should properly work with arguments', () => {
	const card = emptyCardState('void')
	const game = prepareTestState()

	const player = (game.players[0] = {
		...game.players[0],
		heatProduction: 3,
		moneyProduction: 5
	})

	exchangeProduction('heat', 'money').perform(
		{
			card,
			game,
			player
		},
		2
	)

	expect(player.moneyProduction).toBe(7)
	expect(player.heatProduction).toBe(1)
})

test('exchangeProduction should crash with incorrect arguments', () => {
	const card = emptyCardState('void')
	const game = prepareTestState()

	const player = (game.players[0] = {
		...game.players[0],
		heatProduction: 3,
		moneyProduction: 5
	})

	expect(() =>
		exchangeProduction('heat', 'money').perform(
			{
				card,
				game,
				player
			},
			5
		)
	).toThrowError()

	expect(player.moneyProduction).toBe(5)
	expect(player.heatProduction).toBe(3)
})

test('exchangeProduction should have proper conditions', () => {
	const card = emptyCardState('void')
	const game = prepareTestState()

	const player = (game.players[0] = {
		...game.players[0],
		heatProduction: 3,
		moneyProduction: 5
	})

	expect(
		exchangeProduction('heat', 'money').conditions.find(
			c =>
				!c.evaluate(
					{
						card,
						game,
						player
					},
					2
				)
		)
	).toBe(undefined)

	player.heatProduction = 0

	expect(
		exchangeProduction('heat', 'money').conditions.find(
			c =>
				!c.evaluate(
					{
						card,
						game,
						player
					},
					2
				)
		)
	).toBeDefined()
})
