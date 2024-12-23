import { tradeWithColonyAction } from '@shared/player-actions'
import { pushPendingAction } from '@shared/utils/pushPendingAction'
import { SymbolType } from '../types'
import { effect } from './types'
import { playerHasUnusedFleet } from '../conditions'

export const freeTradeWithColony = () =>
	effect({
		description: 'Free trade with a colony',
		symbols: [{ symbol: SymbolType.Colony }],
		conditions: [playerHasUnusedFleet()],
		perform: ({ player }) => {
			pushPendingAction(player, tradeWithColonyAction())
		},
	})
