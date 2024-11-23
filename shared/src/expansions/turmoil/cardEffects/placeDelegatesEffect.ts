import { SymbolType } from '@shared/cards'
import { condition } from '@shared/cards/conditions'
import { effect } from '@shared/cards/effects/types'
import { placeDelegatesAction } from '@shared/player-actions'
import { f, pushPendingAction, quantized } from '@shared/utils'

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
		perform({ player }) {
			pushPendingAction(player, placeDelegatesAction(count))
		},
	})
