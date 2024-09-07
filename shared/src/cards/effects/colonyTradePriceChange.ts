import { SymbolType } from '../types'
import { effect } from './types'

export const colonyTradePriceChange = (change: number) =>
	effect({
		description: `Effect: When you trade, you pay ${-change} less for it.`,
		symbols: [
			{ symbol: SymbolType.ColonyTrade },
			{ symbol: SymbolType.Colon },
			// TODO: Maybe better symbol for this?
			{ count: change },
		],
		perform: ({ player }) => {
			player.colonyTradeResourceCostChange =
				(player.colonyTradeResourceCostChange ?? 0) + change
		},
	})
