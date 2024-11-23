import { SymbolType } from '@shared/cards'
import { committeePartyArg } from '@shared/cards/args'
import { condition } from '@shared/cards/conditions'
import { effect } from '@shared/cards/effects/types'
import { f, quantized } from '@shared/utils'
import { addDelegate } from '../utils/addDelegate'
import { getPartyState } from '../utils/getPartyState'

export const placeDelegatesEffect = (count: number) =>
	effect({
		description: f(
			'Place {0} from reserve to party',
			quantized(count, 'delegate', 'delegates'),
		),
		symbols: [{ symbol: SymbolType.Delegate, count }],
		conditions: [
			condition({
				evaluate: ({ game, player }) =>
					game.committee.reserve.some((p) => p?.id === player.id),
			}),
		],
		args: [committeePartyArg()],
		perform({ game, player }, partyCode) {
			if (typeof partyCode !== 'string') {
				throw new Error(
					'Card argument mismatch - partyCode to be string, got ' +
						JSON.stringify(partyCode),
				)
			}

			const party = getPartyState(game, partyCode)

			for (let i = 0; i < count; i++) {
				const reserveIndex = game.committee.reserve.findIndex(
					(delegate) => delegate?.id === player.id,
				)

				if (reserveIndex < 0) {
					break
				}

				game.committee.reserve.splice(reserveIndex, 1)
				addDelegate(game, party.code, { id: player.id })
			}
		},
	})
