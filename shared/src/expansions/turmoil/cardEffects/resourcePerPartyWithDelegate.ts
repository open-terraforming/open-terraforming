import { Resource, SymbolType } from '@shared/cards'
import { effect } from '@shared/cards/effects/types'
import { updatePlayerResource } from '@shared/cards/utils'
import { withUnits } from '@shared/units'
import { f } from '@shared/utils'

export const resourcePerPartyWithDelegate = (
	resource: Resource,
	amount: number,
) =>
	effect({
		description: f(
			'Gain {0} per party where you have at least 1 delegate',
			withUnits(resource, amount),
		),
		symbols: [
			{ resource, count: amount },
			{ symbol: SymbolType.Slash },
			{ symbol: SymbolType.Delegate },
		],
		perform({ game, player }) {
			const partiesWithDelegates = game.committee.parties.filter((party) =>
				party.members.some((delegate) => delegate.playerId?.id === player.id),
			)

			updatePlayerResource(
				player,
				resource,
				Math.floor(partiesWithDelegates.length * amount),
			)
		},
	})
