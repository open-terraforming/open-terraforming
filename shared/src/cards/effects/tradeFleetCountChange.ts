import { quantized } from '@shared/utils/quantized'
import { tradeFleeCountCondition } from '../conditions'
import { effect } from './types'
import { SymbolType } from '../types'

export const tradeFleetCountChange = (change: number) =>
	effect({
		symbols: [{ symbol: SymbolType.TradeFleet, count: 1 }],
		description:
			change > 0
				? `Gain ${change} ${quantized(change, 'trade fleet', 'trade fleets')}`
				: `Lose ${change} ${quantized(change, 'trade fleet', 'trade fleets')}`,
		conditions: change < 0 ? [tradeFleeCountCondition(1)] : [],
		perform: ({ player }) => {
			player.tradeFleets += change
		},
	})
