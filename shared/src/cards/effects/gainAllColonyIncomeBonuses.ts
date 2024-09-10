import { getPlayerIndex, range } from '@shared/utils'
import { effect } from './types'
import { ColoniesLookupApi } from '@shared/expansions/colonies/ColoniesLookupApi'

export const gainAllColonyIncomeBonuses = () =>
	effect({
		description: 'Gain all your colonies income bonuses',
		perform: ({ game, player }) => {
			const playerIndex = getPlayerIndex(game, player.id)

			for (const colony of game.colonies) {
				const ownedColonies = colony.playersAtSteps.filter(
					(index) => index === playerIndex,
				).length

				if (ownedColonies === 0) {
					continue
				}

				const incomeBonus = ColoniesLookupApi.get(colony.code).incomeBonus

				// TODO: Should this happen multiple times if player has more than 1 colony? Rules aren't clear about that
				range(0, ownedColonies + 1).forEach(() =>
					incomeBonus.perform({ game, player, colony }),
				)
			}
		},
	})
