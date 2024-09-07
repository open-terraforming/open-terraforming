import { SymbolType } from '../types'
import { effect } from './types'

export const colonyTradePriceChange = (change: number) =>
	effect({
		description: `Effect: When you trade, you pay ${-change} less for it.`,
		symbols: [
			{ symbol: SymbolType.ColonyTrade },
			{ symbol: SymbolType.Colon },
			// TODO: Maybe better symbol for this?
			{ resource: 'money', count: change },
		],
		perform: ({ player }) => {
			player.colonyTradeMoneyCostChange =
				(player.colonyTradeMoneyCostChange ?? 0) + change
		},
	})
