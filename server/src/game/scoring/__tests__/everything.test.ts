/* eslint-disable @typescript-eslint/no-explicit-any */
import { initialGameState, initialPlayerState } from '@shared/states'
import { range } from '@shared/utils'
import { CardsLookupApi, CardEffectTarget } from '@shared/cards'
import { getPossibleArgs } from '../args/get-possible-args'
import { emptyCardState, isCardActionable } from '@shared/cards/utils'
import { getBestArgs } from '../utils'
import { inspect } from 'util'

const prepareGame = () => {
	const game = initialGameState()
	game.generation = 1

	game.players = range(0, 3).map(i => {
		const player = initialPlayerState(i + 1)
		player.money = 30
		player.ore = 2
		player.titan = 3
		player.plants = 7
		player.energy = 5
		player.heat = 7

		const card = emptyCardState('united_nations_mars_initiative')

		player.usedCards.push(card)

		return player
	})

	return game
}

const pretty = <A>(a: A) => inspect(a, { depth: 20, colors: true })

it('should prepare arguments correctly', () => {
	const game = prepareGame()
	const player = game.players[0]
	const card = CardsLookupApi.get('united_nations_mars_initiative')

	const cardState = player.usedCards[0]

	const effectsArgs = getPossibleArgs(
		player,
		game,
		card.actionEffects,
		cardState
	)

	effectsArgs.forEach((e, ei) => {
		card.actionEffects[ei].args.forEach((a, ai) => {
			console.log(
				`Possible args for ${ei} -> ${ai} (${CardEffectTarget[a.type]})`,

				pretty(e[ai])
			)
		})
	})

	console.log(pretty(effectsArgs))

	console.log(pretty(getBestArgs(game, player, cardState, card.actionEffects)))
})
