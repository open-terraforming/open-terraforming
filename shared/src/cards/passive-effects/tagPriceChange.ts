import { withUnits } from '@shared/units'
import { passiveEffect } from '../passive-effects'
import { CardCategory, SymbolType } from '../types'

export const tagPriceChange = (tag: CardCategory, change: number) =>
	passiveEffect({
		description: `When you play a ${
			CardCategory[tag]
		} card, you pay ${withUnits('money', -change)} less for it`,
		symbols: [
			{ tag },
			{ symbol: SymbolType.Colon },
			{ resource: 'money', count: change },
		],
		onPlay: ({ player }) => {
			const prev = player.tagPriceChange[tag] ?? 0
			player.tagPriceChange[tag] = prev + change
		},
	})
