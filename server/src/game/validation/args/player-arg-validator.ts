import { ValidatorContext } from './types'
import { gamePlayer } from '@shared/cards/utils'

export const playerArgValidator = ({
	a,
	value,
	ctx: { game, card }
}: ValidatorContext) => {
	if (typeof value !== 'number') {
		throw new Error('Has to be number')
	}

	if (value === -1 && !a.optional) {
		throw new Error('Player is required')
	}

	if (value === -1) {
		return
	}

	const selectedPlayer = gamePlayer(game, value)

	const errors = a.playerConditions.filter(
		c =>
			!c.evaluate({
				game,
				player: selectedPlayer,
				card
			})
	)

	if (errors.length > 0) {
		throw new Error(
			'Conditions not met: ' +
				errors.map((e, i) => e.description || i.toString()).join(', ')
		)
	}
}
