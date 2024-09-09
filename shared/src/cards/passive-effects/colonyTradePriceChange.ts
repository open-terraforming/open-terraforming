import { passiveEffect } from '../passive-effects'
import { SymbolType } from '../types'

export const colonyTradePriceChange = (change: number) =>
	passiveEffect({
		description: `Effect: When you trade, you pay ${-change} less for it.`,
		symbols: [
			{ symbol: SymbolType.ColonyTrade },
			{ symbol: SymbolType.Colon },
			// TODO: Maybe better symbol for this?
			{ count: change },
		],
		onPlay: ({ player }) => {
			player.colonyTradeResourceCostChange =
				(player.colonyTradeResourceCostChange ?? 0) + change
		},
	})
