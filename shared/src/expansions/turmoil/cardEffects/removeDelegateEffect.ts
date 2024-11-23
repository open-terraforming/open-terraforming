import { SymbolType } from '@shared/cards'
import { condition } from '@shared/cards/conditions'
import { effect } from '@shared/cards/effects/types'
import { removeDelegateAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils'

export const removeDelegateEffect = () =>
	effect({
		description: 'Remove any NON-LEADER delegate',
		symbols: [{ symbol: SymbolType.Delegate, count: -1, other: true }],
		conditions: [
			condition({
				evaluate: ({ game }) =>
					game.committee.parties.some((p) => p.members.length > 0),
			}),
		],
		perform({ player }) {
			pushPendingAction(player, removeDelegateAction())
		},
	})
