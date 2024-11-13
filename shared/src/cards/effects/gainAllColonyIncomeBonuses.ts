import { ColoniesLookupApi } from '@shared/ColoniesLookupApi'
import { range } from '@shared/utils'
import { effect } from './types'

export const gainAllColonyIncomeBonuses = () =>
	effect({
		description: 'Gain all your colonies income bonuses',
		perform: ({ game, player }) => {
			for (const colony of game.colonies) {
				const ownedColonies = colony.playersAtSteps.filter(
					(index) => index === player.id,
				).length

				if (ownedColonies === 0) {
					continue
				}

				const incomeBonus = ColoniesLookupApi.get(colony.code).incomeBonus

				// TODO: Should this happen multiple times if player has more than 1 colony? Rules aren't clear about that
				range(0, ownedColonies).forEach(() =>
					incomeBonus.perform({ game, player, colony }),
				)
			}
		},
	})
